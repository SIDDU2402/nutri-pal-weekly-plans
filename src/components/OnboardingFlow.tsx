
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { User, ChevronRight, CheckCircle } from "lucide-react";

interface OnboardingData {
  basicInfo: {
    name: string;
    age: string;
    gender: string;
    weight: string;
    height: string;
  };
  goals: {
    primaryGoal: string;
  };
  lifestyle: {
    activityLevel: string;
  };
  dietary: {
    allergies: string[];
    cuisines: string[];
  };
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    basicInfo: { name: '', age: '', gender: '', weight: '', height: '' },
    goals: { primaryGoal: '' },
    lifestyle: { activityLevel: '' },
    dietary: { allergies: [], cuisines: [] }
  });
  const { toast } = useToast();

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    if (!data.basicInfo.name || !data.basicInfo.age || !data.goals.primaryGoal) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    onComplete(data);
  };

  const updateData = (section: keyof OnboardingData, updates: any) => {
    setData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...updates }
    }));
  };

  const toggleArrayItem = (section: 'allergies' | 'cuisines', item: string) => {
    setData(prev => ({
      ...prev,
      dietary: {
        ...prev.dietary,
        [section]: prev.dietary[section].includes(item)
          ? prev.dietary[section].filter(i => i !== item)
          : [...prev.dietary[section], item]
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to NutriSenseAI!</h1>
          <p className="text-gray-600">Let's personalize your wellness journey</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step <= currentStep ? 'bg-green-500 text-white' : 'bg-gray-200'
                }`}>
                  {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
                </div>
                {step < 4 && <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />}
              </div>
            ))}
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {currentStep === 1 && "Basic Information"}
              {currentStep === 2 && "Your Goals"}
              {currentStep === 3 && "Lifestyle"}
              {currentStep === 4 && "Dietary Preferences"}
            </CardTitle>
            <CardDescription>
              Step {currentStep} of 4
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={data.basicInfo.name}
                    onChange={(e) => updateData('basicInfo', { name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      value={data.basicInfo.age}
                      onChange={(e) => updateData('basicInfo', { age: e.target.value })}
                      placeholder="25"
                    />
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <Select value={data.basicInfo.gender} onValueChange={(value) => updateData('basicInfo', { gender: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="weight">Weight (lbs)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={data.basicInfo.weight}
                      onChange={(e) => updateData('basicInfo', { weight: e.target.value })}
                      placeholder="150"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Height (inches)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={data.basicInfo.height}
                      onChange={(e) => updateData('basicInfo', { height: e.target.value })}
                      placeholder="70"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <Label>Primary Health Goal *</Label>
                <Select value={data.goals.primaryGoal} onValueChange={(value) => updateData('goals', { primaryGoal: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your primary goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight_loss">Weight Loss</SelectItem>
                    <SelectItem value="weight_gain">Weight Gain</SelectItem>
                    <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                    <SelectItem value="maintenance">Maintain Current Weight</SelectItem>
                    <SelectItem value="general_health">General Health</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <Label>Activity Level</Label>
                <Select value={data.lifestyle.activityLevel} onValueChange={(value) => updateData('lifestyle', { activityLevel: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                    <SelectItem value="lightly_active">Lightly Active (1-3 days/week)</SelectItem>
                    <SelectItem value="moderately_active">Moderately Active (3-5 days/week)</SelectItem>
                    <SelectItem value="very_active">Very Active (6-7 days/week)</SelectItem>
                    <SelectItem value="extremely_active">Extremely Active (2x/day or intense training)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <Label>Food Allergies</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {['Nuts', 'Dairy', 'Gluten', 'Shellfish', 'Eggs', 'Soy'].map((allergy) => (
                      <div key={allergy} className="flex items-center space-x-2">
                        <Checkbox
                          id={allergy}
                          checked={data.dietary.allergies.includes(allergy)}
                          onCheckedChange={() => toggleArrayItem('allergies', allergy)}
                        />
                        <Label htmlFor={allergy}>{allergy}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Preferred Cuisines</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {['Italian', 'Mexican', 'Asian', 'Mediterranean', 'American', 'Indian'].map((cuisine) => (
                      <div key={cuisine} className="flex items-center space-x-2">
                        <Checkbox
                          id={cuisine}
                          checked={data.dietary.cuisines.includes(cuisine)}
                          onCheckedChange={() => toggleArrayItem('cuisines', cuisine)}
                        />
                        <Label htmlFor={cuisine}>{cuisine}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              <Button onClick={handleNext}>
                {currentStep === 4 ? 'Complete Setup' : 'Next'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingFlow;
