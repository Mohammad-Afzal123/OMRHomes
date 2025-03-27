import React, { useState } from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Home, User, Users, Building, Check, Scroll, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

export default function AgreementForm() {
  const form = useFormContext();
  const [selectedTab, setSelectedTab] = useState('landlord');
  const [formProgress, setFormProgress] = useState(0);
  
  // Update progress based on filled fields
  React.useEffect(() => {
    const values = form.getValues();
    let filledCount = 0;
    let totalFields = 0;
    
    // Count landlord fields
    const landlordFields = ['name', 'address', 'phone', 'email'];
    landlordFields.forEach(field => {
      totalFields++;
      if (values.landlord && values.landlord[field]) filledCount++;
    });
    
    // Count tenant fields
    const tenantFields = ['name', 'address', 'phone', 'email'];
    tenantFields.forEach(field => {
      totalFields++;
      if (values.tenant && values.tenant[field]) filledCount++;
    });
    
    // Count property fields
    const propertyFields = ['address', 'type', 'rent', 'deposit', 'startDate', 'endDate'];
    propertyFields.forEach(field => {
      totalFields++;
      if (values.property && values.property[field]) filledCount++;
    });
    
    // Count other fields
    if (values.utilities && values.utilities.length) filledCount++;
    totalFields++;
    
    if (values.amenities && values.amenities.length) filledCount++;
    totalFields++;
    
    if (values.specialConditions) filledCount++;
    totalFields++;
    
    const progress = Math.round((filledCount / totalFields) * 100);
    setFormProgress(progress);
  }, [form.watch()]);

  const utilityOptions = [
    { id: 'electricity', label: 'Electricity' },
    { id: 'water', label: 'Water' },
    { id: 'internet', label: 'Internet' },
    { id: 'gas', label: 'Gas' },
    { id: 'maintenance', label: 'Maintenance' },
    { id: 'garbage', label: 'Garbage Collection' },
    { id: 'security', label: 'Security Services' },
  ];

  const propertyTypeOptions = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'villa', label: 'Villa' },
    { value: 'condo', label: 'Condominium' },
    { value: 'studio', label: 'Studio' },
    { value: 'office', label: 'Office Space' },
    { value: 'shop', label: 'Shop/Commercial' },
  ];

  // Animation variants for the form fields
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="space-y-8">
      {/* Progress Bar */}
      <div className="w-full bg-gray-100 rounded-full h-2.5 mb-4">
        <div 
          className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${formProgress}%` }}
        />
      </div>
      
      <div className="flex justify-between text-sm">
        <span>Form Completion: {formProgress}%</span>
        {formProgress === 100 && (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center">
            <Check className="w-3 h-3 mr-1" />
            All fields completed
          </Badge>
        )}
      </div>
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="landlord" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Landlord
          </TabsTrigger>
          <TabsTrigger value="tenant" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Tenant
          </TabsTrigger>
          <TabsTrigger value="property" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            Property
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="landlord">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                <CardTitle>Landlord Information</CardTitle>
              </div>
              <CardDescription>Enter the landlord's contact information and details.</CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="landlord.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Landlord's Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter landlord's full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="landlord.address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Landlord's Address</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter landlord's address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="landlord.phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="landlord.email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter email address" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                </div>
                
                <motion.div variants={itemVariants} className="flex justify-end">
                  <Button type="button" onClick={() => setSelectedTab('tenant')} className="flex items-center gap-2">
                    Continue to Tenant Info
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tenant">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <CardTitle>Tenant Information</CardTitle>
              </div>
              <CardDescription>Enter the tenant's contact information and details.</CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="tenant.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tenant's Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter tenant's full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="tenant.address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tenant's Current Address</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter tenant's current address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="tenant.phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="tenant.email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter email address" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                </div>
                
                <motion.div variants={itemVariants} className="flex justify-end">
                  <Button type="button" onClick={() => setSelectedTab('property')} className="flex items-center gap-2">
                    Continue to Property Info
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="property">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-primary" />
                <CardTitle>Property and Terms</CardTitle>
              </div>
              <CardDescription>Enter property details, rent, and lease terms.</CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="property.address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Address</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter the property address for rent" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="property.type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select property type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {propertyTypeOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="property.rent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monthly Rent (₹)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter monthly rent amount" 
                              type="number" 
                              {...field}
                              onChange={e => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="property.deposit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Security Deposit (₹)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter security deposit amount" 
                              type="number" 
                              {...field}
                              onChange={e => field.onChange(parseFloat(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="property.startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Lease Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(new Date(field.value), "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value ? new Date(field.value) : undefined}
                                onSelect={date => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="property.endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Lease End Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(new Date(field.value), "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value ? new Date(field.value) : undefined}
                                onSelect={date => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                </div>
                
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="utilities"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Utilities Included</FormLabel>
                          <FormDescription>
                            Select all utilities that are included in the rent
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {utilityOptions.map((item) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="utilities"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value || [], item.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== item.id
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {item.label}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="amenities"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amenities Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe any amenities included with the property (e.g., furniture, appliances, parking)"
                            {...field}
                            onChange={e => field.onChange(e.target.value.split(','))}
                            value={field.value?.join(', ') || ''}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter amenities separated by commas
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="specialConditions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Conditions</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter any special conditions or clauses for this agreement"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-between">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="button" className="flex items-center gap-2">
          <Scroll className="w-4 h-4" />
          Preview Agreement
        </Button>
      </div>
    </div>
  );
} 