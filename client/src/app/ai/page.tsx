"use client"
import ReactMarkdown from "react-markdown";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload, Copy, Twitter, Instagram, Linkedin } from "lucide-react";
import { GoogleGenerativeAI, Part } from "@google/generative-ai";

import { AnimatePresence, motion } from "framer-motion";
import { TwitterMock } from "@/components/social-mocks/TwitterMock";
import { InstagramMock } from "@/components/social-mocks/InstagramMock";
import { LinkedInMock } from "@/components/social-mocks/LinkedInMock";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const contentTypes = [
  { value: "twitter", label: "Twitter Thread" },
  { value: "instagram", label: "Instagram Caption" },
  { value: "linkedin", label: "LinkedIn Post" },
];

const MAX_TWEET_LENGTH = 1000;
const POINTS_PER_GENERATION = 5;

export default function GenerateContent() {
  const [contentType, setContentType] = useState(contentTypes[0].value);
  const [prompt, setPrompt] = useState("");
  const [generatedContent, setGeneratedContent] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [metrics, setMetrics] = useState({
    viralityPrediction: 0,
    predictedEngagement: 0,
    averageReach: 0,
    estimatedCTR: 0,
    engagementGrowthRate: 0,
    sentimentScore: "neutral",
  });

  useEffect(() => {
    if (!apiKey) {
      console.error("Gemini API key is not set");
    }
  }, []);

  const handleGenerate = async () => {
    if (!genAI) {
      alert("API key not set.");
      return;
    }

    setIsLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      let promptText = `Generate ${contentType} content about "${prompt}".`;
      if (contentType === "twitter") {
        promptText += " Provide a thread of 5 tweets, each under 280 characters.";
      }

      let imagePart: Part | null = null;
      if (contentType === "instagram" && image) {
        const reader = new FileReader();
        const imageData = await new Promise<string>((resolve) => {
          reader.onload = (e) => {
            if (e.target && typeof e.target.result === "string") {
              resolve(e.target.result);
            } else {
              resolve("");
            }
          };
          reader.readAsDataURL(image);
        });

        const base64Data = imageData.split(",")[1];
        if (base64Data) {
          imagePart = {
            inlineData: {
              data: base64Data,
              mimeType: image.type,
            },
          };
        }
        promptText += " Describe the image and incorporate it into the caption.";
      }

      const parts: (string | Part)[] = [promptText];
      if (imagePart) parts.push(imagePart);

      const result = await model.generateContent(parts);
      const generatedText = result.response.text();

      let content: string[];
      if (contentType === "twitter") {
        content = generatedText
          .split("\n\n")
          .filter((tweet) => tweet.trim() !== "");
      } else {
        content = [generatedText];
      }

      setGeneratedContent(content);

      // Predict metrics based on generated content
      const metricsPrediction = await predictMetrics(generatedText, contentType);
      setMetrics(metricsPrediction);
    } catch (error) {
      console.error("Error generating content:", error);
      setGeneratedContent(["An error occurred while generating content."]);
    } finally {
      setIsLoading(false);
    }
  };

  const predictMetrics = async (generatedText: string, contentType: string): Promise<any> => {
    if (!genAI) {
      console.error("Gemini API is not initialized");
      return {};
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const metricsPrompt = `
      Analyze the following ${contentType} content and provide accurate metrics:
      
      ${generatedText}
      
      Please provide the following metrics:
      1. Virality Prediction (0-100)
      2. Predicted Engagement (0-100)
      3. Average Reach (0-10000)
      4. Estimated CTR (0-100)
      5. Engagement Growth Rate (0-10)
      6. Sentiment Score (positive, neutral, or negative)
      
      Provide your response in JSON format.
    `;

    try {
      const result = await model.generateContent(metricsPrompt);
      const metricsText = result.response.text();
      const metricsJson = JSON.parse(metricsText);

      return {
        viralityPrediction: metricsJson.viralityPrediction || 0,
        predictedEngagement: metricsJson.predictedEngagement || 0,
        averageReach: metricsJson.averageReach || 0,
        estimatedCTR: metricsJson.estimatedCTR || 0,
        engagementGrowthRate: metricsJson.engagementGrowthRate || 0,
        sentimentScore: metricsJson.sentimentScore || "neutral",
      };
    } catch (error) {
      console.error("Error predicting metrics:", error);
      return {
        viralityPrediction: 0,
        predictedEngagement: 0,
        averageReach: 0,
        estimatedCTR: 0,
        engagementGrowthRate: 0,
        sentimentScore: "neutral",
      };
    }
  };

  const renderContentMock = () => {
    if (generatedContent.length === 0) return null;

    switch (contentType) {
      case "twitter":
        return <TwitterMock content={generatedContent} />;
      case "instagram":
        return <InstagramMock content={generatedContent[0]} />;
      case "linkedin":
        return <LinkedInMock content={generatedContent[0]} />;
      default:
        return null;
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Text copied to clipboard');
    }).catch(err => {
      console.error('Error in copying text: ', err);
    });
  };

  const engagementData = [
    { name: 'Day 1', engagement: metrics.predictedEngagement * 0.8 },
    { name: 'Day 2', engagement: metrics.predictedEngagement * 0.9 },
    { name: 'Day 3', engagement: metrics.predictedEngagement },
    { name: 'Day 4', engagement: metrics.predictedEngagement * 1.1 },
    { name: 'Day 5', engagement: metrics.predictedEngagement * 1.2 },
  ];

  const reachData = [
    { name: 'Organic', value: metrics.averageReach * 0.7 },
    { name: 'Paid', value: metrics.averageReach * 0.3 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="bg-transparent p-8 min-h-screen text-slate-900"
    >
      <motion.div
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="space-y-12 mx-auto max-w-6xl"
      >
        <h1 className="bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 font-extrabold text-5xl text-center text-transparent animate-pulse">
          AI-Powered Content Generator
        </h1>

        <motion.div
          className="bg-white/10 shadow-2xl backdrop-blur-lg p-8 rounded-3xl"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="space-y-6">
            <motion.div whileHover={{ scale: 1.05 }} className="relative">
              <label className="block bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2 font-bold text-2xl text-transparent">
                Content Type
              </label>
              <Select onValueChange={setContentType} defaultValue={contentType}>
                <SelectTrigger className="bg-white hover:bg-blue-300 border-none rounded-xl w-full transition duration-300">
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent className="bg-white border-none rounded-xl">
                  {contentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <motion.div
                        className="flex items-center space-x-2"
                        whileHover={{ scale: 1.05, color: "#60a5fa" }}
                      >
                        <div className="w-5 h-5" />
                        <span>{type.label}</span>
                      </motion.div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="relative">
              <label
                htmlFor="prompt"
                className="block bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 mb-2 font-bold text-2xl text-transparent"
              >
                Prompt
              </label>
              <Textarea
                id="prompt"
                placeholder="Enter your prompt here..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="bg-white/5 hover:bg-white/10 border-none rounded-xl focus:ring-2 focus:ring-blue-500 w-full transition duration-300 resize-none"
              />
            </motion.div>

            {contentType === "instagram" && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative space-y-2"
              >
                <label className="block bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500 font-medium text-sm text-transparent">
                  Upload Image
                </label>
                <div className="flex items-center space-x-3">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex items-center bg-gradient-to-r from-pink-500 hover:from-pink-400 to-indigo-500 hover:to-indigo-400 px-4 py-2 rounded-xl text-white transition duration-300 cursor-pointer"
                  >
                    <Upload size={18} />
                    <span>Upload Image</span>
                  </label>
                  {image && (
                    <button
                      onClick={() => setImage(null)}
                      className="flex items-center bg-gradient-to-r from-pink-500 hover:from-pink-400 to-indigo-500 hover:to-indigo-400 px-4 py-2 rounded-xl text-white transition duration-300 cursor-pointer"
                    >
                      <Copy size={18} />
                      <span>Remove Image</span>
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGenerate}
                disabled={isLoading || !prompt}
                className="relative bg-gradient-to-r from-blue-500 hover:from-pink-500 via-sky-500 hover:via-sky-500 to-pink-500 hover:to-blue-600 shadow-lg py-3 rounded-xl focus:ring-2 focus:ring-blue-800 focus:ring-offset-2 w-full font-semibold text-white transform transition-all hover:-translate-y-1 duration-300 overflow-hidden focus:outline-none"
                style={{
                  boxShadow: '0 0 20px #4299e1, 0 0 40px #9f7aea, 0 0 60px #667eea',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-pink-500 to-purple-500 opacity-75 blur-2xl"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-600 opacity-50 animate-pulse"></div>
                <div className="relative z-10 flex justify-center items-center">
                  {isLoading ? (
                    <>
                      <Loader2 className="inline mr-2 w-5 h-5 text-white animate-spin" />
                      <span className="text-lg tracking-wide">Generating...</span>
                    </>
                  ) : (
                    <span className="text-lg tracking-wide">✨Generate Content with AI</span>
                  )}
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>
        <AnimatePresence>
          {generatedContent.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <motion.div
                className="bg-white/10 shadow-2xl backdrop-blur-lg p-8 rounded-3xl"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <h2 className="bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 mb-6 font-bold text-3xl text-transparent">
                  Generated Content
                </h2>
                {contentType === "twitter" ? (
                  <div className="space-y-4">
                    {generatedContent.map((tweet, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 hover:bg-white/10 p-4 rounded-xl transition duration-300"
                      >
                        <ReactMarkdown className="max-w-none prose-invert prose">
                          {tweet}
                        </ReactMarkdown>
                        <div className="flex justify-between items-center mt-2 text-gray-900 text-xs">
                          <span>{tweet.length}/{MAX_TWEET_LENGTH}</span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => copyToClipboard(tweet)}
                            className="bg-gradient-to-r from-blue-500 hover:from-purple-400 to-cyan-400 hover:to-blue-600 p-2 rounded-full text-white transition duration-300"
                          >
                            <Copy className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white/5 hover:bg-white/10 p-4 rounded-xl transition duration-300"
                  >
                    <ReactMarkdown className="max-w-none prose-invert prose">
                      {generatedContent[0]}
                    </ReactMarkdown>
                    <div className="flex justify-end mt-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => copyToClipboard(generatedContent[0])}
                        className="bg-gradient-to-r from-blue-300 hover:from-purple-400 to-blue-800 hover:to-blue-600 p-2 rounded-full text-white transition duration-300"
                      >
                        <Copy className="w-10 h-10" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {generatedContent.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <h2 className="bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 font-bold text-2xl text-transparent">
                  Generated Content
                </h2>
                {contentType === "twitter" ? (
                  generatedContent.map((tweet, index) => (
                    <TwitterMock key={index} content={[tweet]} />
                  ))
                ) : (
                  renderContentMock()
                )}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-4 bg-transparent shadow-2xl hover:shadow-3xl p-6 rounded-3xl transform transition-all hover:-translate-y-1 duration-300 ease-in-out hover:scale-105"
              >
                <motion.h2
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ yoyo: Infinity, duration: 2 }}
                  className="bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 mb-8 font-extrabold text-4xl text-center text-transparent tracking-wider"
                >
                  Metrics Dashboard
                </motion.h2>
                <motion.div
                  initial={{ rotateX: 90 }}
                  animate={{ rotateX: 0 }}
                  transition={{ duration: 0.8 }}
                  className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {[
                    { title: "Virality Prediction", value: metrics.viralityPrediction || 0 },
                    { title: "Predicted Engagement", value: metrics.predictedEngagement || 0 },
                    { title: "Average Reach", value: metrics.averageReach || 0 },
                    { title: "Estimated CTR", value: metrics.estimatedCTR || 0 },
                    { title: "Engagement Growth Rate", value: metrics.engagementGrowthRate || 0 },
                    { title: "Sentiment Score", value: metrics.sentimentScore || 0 },
                  ].map((metric, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/10 shadow-xl hover:shadow-2xl backdrop-blur-lg p-6 rounded-2xl transform transition-all hover:-translate-y-2 duration-300 ease-in-out"
                    >
                      <motion.h3
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="mb-4 font-bold text-blue-300 text-xl"
                      >
                        {metric.title}
                      </motion.h3>
                      <motion.p
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
                        className="bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 font-extrabold text-4xl text-transparent"
                      >
                        {typeof metric.value === 'number' ? metric.value.toFixed(2) : metric.value}
                        {metric.title !== "Sentiment Score" && "%"}
                      </motion.p>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Charts Section */}
                <div className="space-y-8 mt-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white/10 shadow-xl backdrop-blur-lg p-6 rounded-2xl"
                  >
                    <h3 className="mb-4 font-bold text-2xl text-blue-300">Engagement Over Time</h3>
                    <div style={{ width: '100%', height: 300 }}>
                      <ResponsiveContainer>
                        <LineChart data={engagementData.length > 0 ? engagementData : [{ name: 'No Data', engagement: 0 }]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="engagement" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white/10 shadow-xl backdrop-blur-lg p-6 rounded-2xl"
                  >
                    <h3 className="mb-4 font-bold text-2xl text-blue-300">Reach Distribution</h3>
                    <div style={{ width: '100%', height: 300 }}>
                      <ResponsiveContainer>
                        <PieChart data={reachData.length > 0 ? reachData : [{ name: 'No Data', value: 0 }]}>
                          <Pie
                            data={reachData.length > 0 ? reachData : [{ name: 'No Data', value: 0 }]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {(reachData.length > 0 ? reachData : [{ name: 'No Data', value: 0 }]).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="bg-white/10 shadow-xl backdrop-blur-lg p-6 rounded-2xl"
                  >
                    <h3 className="mb-4 font-bold text-2xl text-blue-300">Metrics Comparison</h3>
                    <div style={{ width: '100%', height: 300 }}>
                      <ResponsiveContainer>
                        <BarChart data={[{ name: 'Metrics', ...metrics }]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="viralityPrediction" fill="#8884d8" />
                          <Bar dataKey="predictedEngagement" fill="#82ca9d" />
                          <Bar dataKey="estimatedCTR" fill="#ffc658" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}