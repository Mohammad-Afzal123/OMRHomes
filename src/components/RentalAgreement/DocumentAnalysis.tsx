import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { 
  FileText, AlertCircle, CheckCircle, Shield, 
  Upload, Loader2, BarChart, FileSearch, MessageSquare,
  PenLine, Scale, ArrowRight, Lightbulb
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';

export default function DocumentAnalysis() {
  const form = useFormContext();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const simulateAnalysis = useCallback(() => {
    setIsAnalyzing(true);
    setAnalysisResults(null);
    
    // Simulate API call delay
    setTimeout(() => {
      const results = {
        summary: {
          parties: "John Doe (Landlord) and Jane Smith (Tenant)",
          property: "123 Main Street, Chennai, Tamil Nadu",
          rentAmount: "₹25,000 per month",
          depositAmount: "₹50,000",
          leaseDuration: "12 months (01-Jan-2023 to 31-Dec-2023)",
          paymentTerms: "Due on the 5th of each month",
          utilitiesIncluded: "Water, Electricity (up to 100 units)"
        },
        legalIssues: [
          {
            severity: "high",
            issue: "Missing mandatory clause on security deposit return timeline",
            recommendation: "Add clause stating security deposit will be returned within 15 days of lease termination"
          },
          {
            severity: "medium",
            issue: "Vague maintenance responsibilities",
            recommendation: "Clearly define landlord and tenant maintenance responsibilities"
          },
          {
            severity: "low",
            issue: "Unclear visitor policy",
            recommendation: "Consider adding a clause about extended guest stays"
          }
        ],
        compliance: {
          score: 82,
          checklist: [
            { item: "Registration requirements", status: "passed" },
            { item: "Rent control adherence", status: "passed" },
            { item: "Security deposit limits", status: "warning", note: "Close to maximum allowed" },
            { item: "Notice periods", status: "passed" },
            { item: "Maintenance obligations", status: "failed", note: "Inadequately defined" },
            { item: "Privacy clauses", status: "passed" }
          ]
        },
        fairness: {
          overallScore: 85,
          categories: [
            { name: "Termination Terms", score: 90 },
            { name: "Rent Increases", score: 85 },
            { name: "Maintenance", score: 70 },
            { name: "Privacy", score: 95 },
            { name: "Penalties", score: 80 }
          ],
          notes: "Agreement is generally fair, but maintenance responsibilities favor the landlord"
        },
        recommendations: [
          "Add a clear timeline for security deposit return",
          "Define maintenance responsibilities more explicitly",
          "Include a structured rent increase formula if lease is renewed",
          "Add a clause for dispute resolution methods",
          "Clarify policy on property modifications by tenant"
        ]
      };
      
      setAnalysisResults(results);
      setIsAnalyzing(false);
    }, 4000);
  }, []);

  const analyzeDocument = () => {
    simulateAnalysis();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Document Analysis</CardTitle>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              <FileSearch className="w-3 h-3 mr-1" />
              AI-Powered Analysis
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {!analysisResults && !isAnalyzing && (
            <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed rounded-lg bg-gray-50">
              <FileText className="w-12 h-12 text-gray-300 mb-3" />
              <h3 className="text-lg font-medium mb-1">Upload a Document</h3>
              <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
                Upload your rental agreement to analyze it for legal compliance, 
                fairness, and potential issues
              </p>
              
              <div className="space-y-4 w-full max-w-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs font-normal text-muted-foreground">Upload document (PDF)</Label>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={onFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      />
                      <div className="flex items-center justify-between border rounded-md px-3 py-2 text-sm">
                        <span className="truncate">
                          {uploadedFile ? uploadedFile.name : "Choose file..."}
                        </span>
                        <Upload className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <Button 
                    onClick={analyzeDocument} 
                    disabled={!uploadedFile && !form.formState.isSubmitted}
                    className="w-full"
                  >
                    {uploadedFile ? (
                      <>
                        Analyze Document
                        <FileSearch className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Generate & Analyze Example
                        <Lightbulb className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {isAnalyzing && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative mb-6">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileSearch className="w-5 h-5 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-medium mb-2">Analyzing Document</h3>
              <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
                Our AI is reviewing your document for legal issues, compliance with 
                local regulations, and fairness analysis
              </p>
              
              <div className="w-full max-w-md space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Extracting text and clauses</span>
                    <span>Complete</span>
                  </div>
                  <Progress value={100} />
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Checking legal compliance</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="animate-progress" />
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Analyzing fairness</span>
                    <span>40%</span>
                  </div>
                  <Progress value={40} className="animate-progress" />
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Generating recommendations</span>
                    <span>10%</span>
                  </div>
                  <Progress value={10} className="animate-progress" />
                </div>
              </div>
            </div>
          )}

          {analysisResults && (
            <div className="pt-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="summary">
                    <MessageSquare className="w-4 h-4 mr-1 md:mr-2" />
                    <span className="hidden md:inline">Summary</span>
                    <span className="inline md:hidden">Sum</span>
                  </TabsTrigger>
                  <TabsTrigger value="legal">
                    <Shield className="w-4 h-4 mr-1 md:mr-2" />
                    <span className="hidden md:inline">Legal Issues</span>
                    <span className="inline md:hidden">Legal</span>
                  </TabsTrigger>
                  <TabsTrigger value="fairness">
                    <Scale className="w-4 h-4 mr-1 md:mr-2" />
                    <span className="hidden md:inline">Fairness</span>
                    <span className="inline md:hidden">Fair</span>
                  </TabsTrigger>
                  <TabsTrigger value="recommendations">
                    <Lightbulb className="w-4 h-4 mr-1 md:mr-2" />
                    <span className="hidden md:inline">Recommendations</span>
                    <span className="inline md:hidden">Rec</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="summary" className="space-y-4">
                  <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                    <h3 className="font-medium flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Agreement Summary
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      {Object.entries(analysisResults.summary).map(([key, value]) => (
                        <div key={key} className="flex flex-col space-y-1">
                          <span className="text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                          </span>
                          <span>{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <FileSearch className="w-4 h-4 text-blue-700" />
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-900">Analysis Overview</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          This agreement generally follows standard formats but has a few legal issues 
                          that should be addressed. The compliance score is {analysisResults.compliance.score}%, 
                          with a fairness rating of {analysisResults.fairness.overallScore}%.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="legal" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Legal Issues ({analysisResults.legalIssues.length})</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Compliance: {analysisResults.compliance.score}%
                        </Badge>
                      </div>
                    </div>
                    
                    {analysisResults.legalIssues.map((issue: any, index: number) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`border p-3 rounded-lg ${
                          issue.severity === 'high' 
                            ? 'bg-red-50 border-red-200' 
                            : issue.severity === 'medium'
                              ? 'bg-yellow-50 border-yellow-200'
                              : 'bg-blue-50 border-blue-200'
                        }`}
                      >
                        <div className="flex items-start">
                          <div className={`rounded-full p-1 mr-3 ${
                            issue.severity === 'high' 
                              ? 'text-red-600 bg-red-100' 
                              : issue.severity === 'medium'
                                ? 'text-yellow-600 bg-yellow-100'
                                : 'text-blue-600 bg-blue-100'
                          }`}>
                            <AlertCircle className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-sm">
                                {issue.issue}
                              </h4>
                              <Badge variant="outline" className={`text-xs ${
                                issue.severity === 'high' 
                                  ? 'bg-red-100 text-red-700 border-red-200' 
                                  : issue.severity === 'medium'
                                    ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                    : 'bg-blue-100 text-blue-700 border-blue-200'
                              }`}>
                                {issue.severity.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm mt-1 text-muted-foreground">
                              {issue.recommendation}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    <div className="border-t mt-4 pt-4">
                      <h3 className="font-medium mb-3">Compliance Checklist</h3>
                      <div className="space-y-2">
                        {analysisResults.compliance.checklist.map((item: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                            <div className="flex items-center">
                              {item.status === 'passed' ? (
                                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                              ) : item.status === 'warning' ? (
                                <AlertCircle className="w-4 h-4 text-yellow-600 mr-2" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                              )}
                              <span className="text-sm">{item.item}</span>
                            </div>
                            {item.note && (
                              <span className="text-xs text-muted-foreground">
                                {item.note}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="fairness" className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Fairness Analysis</h3>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100/80">
                      Score: {analysisResults.fairness.overallScore}/100
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    {analysisResults.fairness.categories.map((category: any, index: number) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">{category.name}</span>
                          <span className="text-sm font-medium">{category.score}/100</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div 
                            className={`h-full ${
                              category.score >= 90 ? 'bg-green-500' :
                              category.score >= 70 ? 'bg-blue-500' :
                              category.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${category.score}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                          />
                        </div>
                      </div>
                    ))}
                    
                    <div className="bg-muted/30 p-4 rounded-lg mt-4">
                      <h4 className="font-medium mb-2 flex items-center">
                        <Scale className="w-4 h-4 mr-2" />
                        Fairness Notes
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {analysisResults.fairness.notes}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="recommendations" className="space-y-4">
                  <h3 className="font-medium mb-4">Recommended Improvements</h3>
                  <div className="space-y-3">
                    {analysisResults.recommendations.map((rec: string, index: number) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-start bg-muted/30 p-3 rounded-lg"
                      >
                        <ArrowRight className="w-4 h-4 text-primary mr-3 mt-0.5" />
                        <span className="text-sm">{rec}</span>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="flex justify-center mt-6">
                    <Button className="w-full max-w-xs">
                      <PenLine className="w-4 h-4 mr-2" />
                      Apply Recommended Changes
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
} 