import { ContractAnalysis } from "@/interfaces/contract.interface";
import { ReactNode, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import OverallScoreChart from "./chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Accordion, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { AccordionContent } from "@radix-ui/react-accordion";

interface IContractAnalysisResultsProps {
  analysisResults: ContractAnalysis;
  isActive: boolean;
  contractId: string;
  onUpgrade: () => void;
}

export default function ContractAnalysisResults({
  analysisResults,
  isActive,
  onUpgrade,
}: IContractAnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState("summary");

  if (!analysisResults) {
    return <div className="font-bold text-3xl text-center text-gray-400 animate-pulse">No results available</div>;
  }

  const getScore = () => {
    const score = analysisResults.overallScore;
    if (score > 70)
      return { icon: ArrowUp, color: "text-green-500", text: "Good" };
    if (score < 50)
      return { icon: ArrowDown, color: "text-red-500", text: "Bad" };
    return { icon: Minus, color: "text-yellow-500", text: "Average" };
  };

  const scoreTrend = getScore();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-gradient-to-r from-red-500 to-pink-500 text-white";
      case "medium":
        return "bg-gradient-to-r from-yellow-400 to-orange-500 text-white";
      case "low":
        return "bg-gradient-to-r from-green-400 to-emerald-500 text-white";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-gradient-to-r from-purple-500 to-indigo-500 text-white";
      case "medium":
        return "bg-gradient-to-r from-blue-400 to-cyan-500 text-white";
      case "low":
        return "bg-gradient-to-r from-teal-400 to-green-500 text-white";
    }
  };

  const renderRisksAndOpportunities = (
    items: Array<{
      risk?: string;
      opportunity?: string;
      explanation?: string;
      severity?: string;
      impact?: string;
    }>,
    type: "risks" | "opportunities"
  ) => {
    const displayItems = isActive ? items : items.slice(0, 3);
    const fakeItems = {
      risk: type === "risks" ? "Hidden Risk" : undefined,
      opportunity: type === "opportunities" ? "Hidden Opportunity" : undefined,
      explanation: "Hidden Explanation",
      severity: "low",
      impact: "low",
    };

    return (
      <ul className="space-y-8">
        {displayItems.map((item, index) => (
          <motion.li
            className="border-gray-200 bg-gradient-to-br from-white via-purple-50 to-indigo-50 shadow-xl hover:shadow-2xl p-8 border rounded-2xl transform transition-all duration-500 hover:scale-105 hover:rotate-1"
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex justify-between items-start mb-6">
              <span className="bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 font-extrabold text-2xl text-transparent hover:text-3xl transition-all duration-300">
                {type === "risks" ? item.risk : item.opportunity}
              </span>
              {(item.severity || item.impact) && (
                <Badge
                  className={`${
                    type === "risks"
                      ? getSeverityColor(item.severity!)
                      : getImpactColor(item.impact!)
                  } px-6 py-2 rounded-full font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 hover:-rotate-3`}
                >
                  {(item.severity || item.impact)?.toUpperCase()}
                </Badge>
              )}
            </div>
            <p className="mt-4 text-gray-700 text-lg hover:text-xl hover:text-gray-900 leading-relaxed transition-colors duration-300">
              {type === "risks" ? item.explanation : item.explanation}
            </p>
          </motion.li>
        ))}
        {!isActive && items.length > 3 && (
          <motion.li
            className="border-gray-200 bg-gradient-to-br from-gray-100 via-purple-50 to-indigo-50 shadow-2xl blur-sm p-8 border rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: displayItems.length * 0.1 }}
          >
            <div className="flex justify-between items-start mb-6">
              <span className="bg-clip-text bg-gradient-to-r from-gray-400 via-purple-400 to-indigo-400 font-extrabold text-2xl text-transparent">
                {type === "risks" ? fakeItems.risk : fakeItems.opportunity}
              </span>
              <Badge className="bg-gradient-to-r from-gray-300 to-gray-400 shadow-lg px-6 py-2 rounded-full font-bold text-gray-600 text-sm">
                {(fakeItems.severity || fakeItems.impact)?.toUpperCase()}
              </Badge>
            </div>
          </motion.li>
        )}
      </ul>
    );
  };

  const renderPremiumAccordition = (content: ReactNode) => {
    if (isActive) {
      return content;
    }

    return (
      <div className="relative shadow-2xl rounded-2xl overflow-hidden">
        <div className="z-50 absolute inset-0 flex justify-center items-center bg-gradient-to-br from-white/70 via-purple-100/70 to-indigo-100/70 backdrop-blur-lg">
          <Button
            onClick={onUpgrade}
            className="bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 shadow-xl hover:shadow-2xl px-8 py-4 rounded-full font-extrabold text-lg text-white transform hover:scale-110 transition-all duration-300 hover:rotate-3"
          >
            Upgrade to Premium
          </Button>
        </div>
        <div className="opacity-30 filter grayscale">{content}</div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-white mx-auto px-8 py-16 min-h-screen container">
      <div className="flex justify-between items-center mb-12">
        <h1 className="bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 font-extrabold text-5xl text-transparent hover:text-6xl transition-all duration-300">Analysis Results</h1>
        <div className="flex space-x-4">{/* ASK AI BUTTON */}</div>
      </div>

      <Card className="bg-gradient-to-br from-white via-purple-50 to-indigo-50 shadow-2xl hover:shadow-3xl mb-12 rounded-3xl transform transition-all duration-500 overflow-hidden hover:scale-105">
        <CardHeader className="bg-gradient-to-r from-purple-200 via-pink-200 to-indigo-200">
          <CardTitle className="bg-clip-text bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-700 font-extrabold text-4xl text-transparent">Overall Contract Score</CardTitle>
          <CardDescription className="text-gray-700 text-lg">Based on risks and opportunities identified</CardDescription>
        </CardHeader>
        <CardContent className="p-10">
          <div className="flex flex-wrap justify-between items-center">
            <div className="mb-8 lg:mb-0 w-full lg:w-1/2">
              <div className="flex items-center space-x-8 mb-8">
                <div className="bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 font-extrabold text-7xl text-transparent hover:text-8xl transition-all duration-300">
                  {analysisResults.overallScore ?? 0}
                </div>
                <div className={`flex items-center ${scoreTrend.color} text-3xl`}>
                  <scoreTrend.icon className="mr-3 w-10 h-10" />
                  <span className="font-extrabold">{scoreTrend.text}</span>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex justify-between text-xl">
                  <span className="font-bold text-gray-700">Risk</span>
                  <span className="font-extrabold text-red-500">{100 - analysisResults.overallScore}%</span>
                </div>
                <div className="flex justify-between text-xl">
                  <span className="font-bold text-gray-700">Opportunities</span>
                  <span className="font-extrabold text-green-500">{analysisResults.overallScore}%</span>
                </div>
              </div>
              <p className="mt-8 text-gray-700 text-xl hover:text-gray-900 leading-relaxed transition-colors duration-300">
                This score represents the overall risk and opportunities identified in the contract.
              </p>
            </div>

            <div className="flex justify-center items-center w-full lg:w-1/2 h-72">
              <div className="w-full max-w-sm h-full transform hover:scale-110 transition-all duration-300">
                <OverallScoreChart
                  overallScore={analysisResults.overallScore}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
        <TabsList className="grid grid-cols-4 bg-gradient-to-r from-purple-200 via-pink-200 to-indigo-200 p-2 rounded-2xl w-full">
          {["summary", "risks", "opportunities", "details"].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="hover:bg-white data-[state=active]:bg-white data-[state=active]:shadow-lg py-4 rounded-xl font-bold text-xl hover:text-purple-600 data-[state=active]:text-purple-600 capitalize transform transition-all duration-300 hover:scale-105"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="summary">
          <Card className="shadow-2xl hover:shadow-3xl mt-8 rounded-3xl transform transition-all duration-500 overflow-hidden hover:scale-105">
            <CardHeader className="bg-gradient-to-r from-purple-200 via-pink-200 to-indigo-200">
              <CardTitle className="bg-clip-text bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-700 font-extrabold text-3xl text-transparent">Contract Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-2xl text-gray-700 hover:text-gray-900 leading-relaxed transition-colors duration-300">
                {analysisResults.summary}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="risks">
          <Card className="shadow-2xl hover:shadow-3xl mt-8 rounded-3xl transform transition-all duration-500 overflow-hidden hover:scale-105">
            <CardHeader className="bg-gradient-to-r from-red-200 via-pink-200 to-orange-200">
              <CardTitle className="bg-clip-text bg-gradient-to-r from-red-700 via-pink-600 to-orange-700 font-extrabold text-3xl text-transparent">Risks</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {renderRisksAndOpportunities(analysisResults.risks, "risks")}
              {!isActive && (
                <p className="mt-8 font-bold text-center text-gray-500 text-xl hover:text-gray-700 transition-colors duration-300">
                  Upgrade to Premium to see all risks
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="opportunities">
          <Card className="shadow-2xl hover:shadow-3xl mt-8 rounded-3xl transform transition-all duration-500 overflow-hidden hover:scale-105">
            <CardHeader className="bg-gradient-to-r from-green-200 via-emerald-200 to-teal-200">
              <CardTitle className="bg-clip-text bg-gradient-to-r from-green-700 via-emerald-600 to-teal-700 font-extrabold text-3xl text-transparent">Opportunities</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {renderRisksAndOpportunities(
                analysisResults.opportunities,
                "opportunities"
              )}
              {!isActive && (
                <p className="mt-8 font-bold text-center text-gray-500 text-xl hover:text-gray-700 transition-colors duration-300">
                  Upgrade to Premium to see all opportunities
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="details">
          {isActive ? (
            <div className="gap-10 grid md:grid-cols-2">
              <Card className="shadow-2xl hover:shadow-3xl rounded-3xl transform transition-all duration-500 overflow-hidden hover:scale-105">
                <CardHeader className="bg-gradient-to-r from-blue-200 via-cyan-200 to-teal-200">
                  <CardTitle className="bg-clip-text bg-gradient-to-r from-blue-700 via-cyan-600 to-teal-700 font-extrabold text-3xl text-transparent">Contract Details</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <ul className="space-y-6">
                    {analysisResults.keyClauses?.map((keyClause, index) => (
                      <motion.li key={index} className="flex items-center text-gray-700 text-xl hover:text-gray-900 transform transition-colors hover:translate-x-2 duration-300">
                        <span className="mr-4 text-2xl text-purple-600">•</span> {keyClause}
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="shadow-2xl hover:shadow-3xl rounded-3xl transform transition-all duration-500 overflow-hidden hover:scale-105">
                <CardHeader className="bg-gradient-to-r from-yellow-200 via-amber-200 to-orange-200">
                  <CardTitle className="bg-clip-text bg-gradient-to-r from-yellow-700 via-amber-600 to-orange-700 font-extrabold text-3xl text-transparent">Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <ul className="space-y-6">
                    {analysisResults.recommendations?.map(
                      (recommendation, index) => (
                        <motion.li key={index} className="flex items-center text-gray-700 text-xl hover:text-gray-900 transform transition-colors hover:translate-x-2 duration-300">
                          <span className="mr-4 text-2xl text-indigo-600">✓</span> {recommendation}
                        </motion.li>
                      )
                    )}
                  </ul>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="shadow-2xl hover:shadow-3xl mt-8 rounded-3xl transform transition-all duration-500 overflow-hidden hover:scale-105">
              <CardHeader className="bg-gradient-to-r from-gray-200 via-slate-200 to-zinc-200">
                <CardTitle className="bg-clip-text bg-gradient-to-r from-gray-700 via-slate-600 to-zinc-700 font-extrabold text-3xl text-transparent">Contract Details</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <p className="mb-8 text-2xl text-gray-600 hover:text-gray-800 transition-colors duration-300">
                  Upgrade to Premium to see contract detailed analysis, including key clauses and recommendations.
                </p>
                <Button
                  variant={"outline"}
                  onClick={onUpgrade}
                  className="bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 shadow-xl hover:shadow-2xl mt-6 px-8 py-4 rounded-full font-bold text-lg text-white transform hover:scale-110 transition-all duration-300"
                >
                  Upgrade to Premium
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      <Accordion type="single" collapsible className="bg-gradient-to-br from-purple-100 via-pink-100 to-indigo-100 shadow-2xl hover:shadow-3xl mb-8 rounded-3xl transform transition-all duration-500 hover:scale-105">
        {renderPremiumAccordition(
          <>
            <AccordionItem value="contract-details" className="border-2 border-purple-300 bg-white/30 backdrop-blur-lg rounded-2xl overflow-hidden">
              <AccordionTrigger className="bg-clip-text bg-gradient-to-r from-purple-600 hover:from-purple-700 via-pink-500 hover:via-pink-600 to-indigo-600 hover:to-indigo-700 p-6 font-extrabold text-2xl text-transparent transition-all duration-300">
                Contract Details
              </AccordionTrigger>
              <AccordionContent className="bg-white/50 backdrop-blur-xl backdrop-filter p-6">
                <div className="gap-6 grid md:grid-cols-2">
                  <div className="space-y-4 transform hover:scale-105 transition-all duration-300">
                    <h3 className="bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-2 font-bold text-transparent text-xl">
                      Duration and Termination
                    </h3>
                    <p className="text-gray-700 hover:text-gray-900 transition-colors duration-300">{analysisResults.contractDuration}</p>
                    <strong className="block mt-4 text-lg text-pink-600">Termination Conditions</strong>
                    <p className="text-gray-700 hover:text-gray-900 transition-colors duration-300">{analysisResults.terminationConditions}</p>
                  </div>
                  <div className="space-y-4 transform hover:scale-105 transition-all duration-300">
                    <h3 className="bg-clip-text bg-gradient-to-r from-pink-600 to-indigo-600 mb-2 font-bold text-transparent text-xl">Legal Information</h3>
                    <p>
                      <strong className="block text-indigo-600 text-lg">Legal Compliance</strong>
                      <span className="text-gray-700 hover:text-gray-900 transition-colors duration-300">{analysisResults.legalCompliance}</span>
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </>
        )}
      </Accordion>

      <Card className="bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 shadow-2xl hover:shadow-3xl rounded-3xl transform transition-all duration-500 hover:scale-105 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6">
          <CardTitle className="font-extrabold text-3xl text-white">Negotiation Points</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ul className="gap-4 grid md:grid-cols-2">
            {analysisResults.negotiationPoints?.map((point, index) => (
              <li className="flex items-center bg-white/50 shadow-md hover:shadow-lg backdrop-blur-xl backdrop-filter p-4 rounded-xl transform transition-all duration-300 hover:scale-105" key={index}>
                <span className="mr-3 text-2xl text-indigo-600">•</span>
                <span className="text-gray-800 hover:text-gray-900 transition-colors duration-300">{point}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}