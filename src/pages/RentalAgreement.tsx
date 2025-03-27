import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Eye, PenLine, FileSearch } from 'lucide-react';
import AgreementForm from '@/components/RentalAgreement/AgreementForm';
import AgreementPreview from '@/components/RentalAgreement/AgreementPreview';
import SignatureCapture from '@/components/RentalAgreement/SignatureCapture';
import DocumentAnalysis from '@/components/RentalAgreement/DocumentAnalysis';

interface FormData {
  landlord: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  tenant: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  property: {
    address: string;
    type: string;
    rent: number;
    deposit: number;
    startDate: string;
    endDate: string;
  };
  utilities: string[];
  amenities: string[];
  specialConditions: string;
  signatures: {
    landlord: string;
    tenant: string;
    witness1: string;
    witness2: string;
  };
}

export default function RentalAgreement() {
  const [currentTab, setCurrentTab] = useState('create');
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  const form = useForm<FormData>({
    defaultValues: {
      landlord: { name: '', address: '', phone: '', email: '' },
      tenant: { name: '', address: '', phone: '', email: '' },
      property: {
        address: '',
        type: '',
        rent: 0,
        deposit: 0,
        startDate: '',
        endDate: ''
      },
      utilities: [],
      amenities: [],
      specialConditions: '',
      signatures: {
        landlord: '',
        tenant: '',
        witness1: '',
        witness2: ''
      }
    }
  });

  // Handle tab changes with animations
  const handleTabChange = (value: string) => {
    // First fade out
    document.getElementById('tab-content')?.classList.add('opacity-0');
    
    // Then change tab after a short delay
    setTimeout(() => {
      setCurrentTab(value);
      // Then fade back in
      setTimeout(() => {
        document.getElementById('tab-content')?.classList.remove('opacity-0');
      }, 50);
    }, 200);
  };

  const handlePreview = () => {
    handleTabChange('preview');
  };

  const handleContinueToSign = () => {
    handleTabChange('sign');
  };

  const handleContinueToAnalyze = () => {
    handleTabChange('analyze');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl font-bold text-gray-900 mb-2"
            >
              Rental Agreement Generator
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-gray-600"
            >
              Create, preview, sign, and analyze your rental agreements with ease
            </motion.p>
          </div>

          <Card className="p-6 shadow-md">
            <Tabs value={currentTab} onValueChange={handleTabChange}>
              <TabsList className="grid grid-cols-4 gap-4 mb-6">
                <TabsTrigger value="create" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <FileText className="w-4 h-4" />
                  Create
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Eye className="w-4 h-4" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="sign" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <PenLine className="w-4 h-4" />
                  Sign
                </TabsTrigger>
                <TabsTrigger value="analyze" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <FileSearch className="w-4 h-4" />
                  Analyze
                </TabsTrigger>
              </TabsList>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(data => console.log(data))}>
                  <div id="tab-content" className="transition-opacity duration-200">
                    <TabsContent value="create">
                      <div className="space-y-4">
                        <p className="text-sm text-gray-500">
                          Fill out the form below to generate your rental agreement
                        </p>
                        <div className="mt-4">
                          <AgreementForm />
                        </div>
                        <div className="flex justify-end mt-6">
                          <Button type="button" onClick={handlePreview}>
                            Continue to Preview
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="preview">
                      <div className="space-y-4">
                        <p className="text-sm text-gray-500">
                          Preview and download your rental agreement
                        </p>
                        <div className="mt-4">
                          <AgreementPreview />
                        </div>
                        <div className="flex justify-end mt-6">
                          <Button type="button" onClick={handleContinueToSign}>
                            Continue to Sign
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="sign">
                      <div className="space-y-4">
                        <p className="text-sm text-gray-500">
                          Sign your rental agreement digitally
                        </p>
                        <div className="mt-4">
                          <SignatureCapture />
                        </div>
                        <div className="flex justify-end mt-6">
                          <Button type="button" onClick={handleContinueToAnalyze}>
                            Continue to Analysis
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="analyze">
                      <div className="space-y-4">
                        <p className="text-sm text-gray-500">
                          Upload and analyze your rental agreement
                        </p>
                        <div className="mt-4">
                          <DocumentAnalysis />
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                </form>
              </Form>
            </Tabs>
          </Card>
        </motion.div>
      </main>

      <Footer />
      
      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        
        .animate-pulse-once {
          animation: pulse 1s ease-in-out;
        }
        
        .signature-canvas {
          touch-action: none;
        }
      `}</style>
    </div>
  );
} 