
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Leaf, ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
    targetWeight: string;
    timeframe: string;
  };
  dietary: {
    allergies: string[];
    cuisines: string[];
    dietaryRestrictions: string;
  };
  lifestyle: {
    activityLevel: string;
    mealsPerDay: string;
    cookingTime: string;
    budget: string;
  };
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
}

const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    basicInfo: { name: '', age: '', gender: '', weight: '', height: '' },
    goals: { primaryGoal: '', targetWeight: '', timeframe: '' },
    dietary: { allergies: [], cuisines: [], dietaryRestrictions: '' },
    lifestyle: { activityLevel: '', mealsPerDay: '', cookingTime: '', budget: '' }
  });
  const { toast } = useToast();

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const updateData = (section: keyof OnboardingData, field: string, value: any) => {
    setData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      toast({
        title: "Welcome to NutriSenseAI! 🌿",
        description: "Your personalized wellness journey begins now.",
      });
      onComplete(data);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const commonAllergies = ['Nuts', 'Dairy', 'Eggs', 'Soy', 'Gluten', 'Shellfish', 'Fish'];
  const cuisineOptions = ['Italian', 'Asian', 'Mexican', 'Mediterranean', 'Indian', 'American', 'Thai', 'French'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <div className="bg-green-100 p-2 rounded-full mr-2">
              <Leaf className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-green-700">NutriSenseAI Setup</h1>
          </div>
          <Progress value={progress} className="w-full h-2 mb-2" />
          <p className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-gray-800">
              {currentStep === 1 && "Tell us about yourself"}
              {currentStep === 2 && "What are your wellness goals?"}
              {currentStep === 3 && "Dietary preferences & restrictions"}
              {currentStep === 4 && "Lifestyle & cooking preferences"}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {currentStep === 1 && "We'll use this to personalize your nutrition plan"}
              {currentStep === 2 && "Help us understand what you want to achieve"}
              {currentStep === 3 && "Ensure we recommend foods you'll love and can eat safely"}
              {currentStep === 4 && "Let's match your meal plans to your lifestyle"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">What should we call you?</Label>
                  <Input
                    id="name"
                    placeholder="Your first name"
                    value={data.basicInfo.name}
                    onChange={(e) => updateData('basicInfo', 'name', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age" className="text-sm font-medium text-gray-700">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="25"
                      value={data.basicInfo.age}
                      onChange={(e) => updateData('basicInfo', 'age', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Gender</Label>
                    <Select value={data.basicInfo.gender} onValueChange={(value) => updateData('basicInfo', 'gender', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="non-binary">Non-binary</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="weight" className="text-sm font-medium text-gray-700">Current Weight (lbs)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="150"
                      value={data.basicInfo.weight}
                      onChange={(e) => updateData('basicInfo', 'weight', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height" className="text-sm font-medium text-gray-700">Height (inches)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="65"
                      value={data.basicInfo.height}
                      onChange={(e) => updateData('basicInfo', 'height', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Goals */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Primary Goal</Label>
                  <Select value={data.goals.primaryGoal} onValueChange={(value) => updateData('goals', 'primaryGoal', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="What's your main goal?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weight-loss">Weight Loss</SelectItem>
                      <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                      <SelectItem value="maintenance">Maintain Current Weight</SelectItem>
                      <SelectItem value="energy-boost">Increase Energy</SelectItem>
                      <SelectItem value="general-health">General Health & Wellness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="target-weight" className="text-sm font-medium text-gray-700">Target Weight (lbs)</Label>
                    <Input
                      id="target-weight"
                      type="number"
                      placeholder="140"
                      value={data.goals.targetWeight}
                      onChange={(e) => updateData('goals', 'targetWeight', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Timeframe</Label>
                    <Select value={data.goals.timeframe} onValueChange={(value) => updateData('goals', 'timeframe', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="How quickly?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3-months">3 months</SelectItem>
                        <SelectItem value="6-months">6 months</SelectItem>
                        <SelectItem value="1-year">1 year</SelectItem>
                        <SelectItem value="no-rush">No specific timeline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Dietary Preferences */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">Any food allergies or intolerances?</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {commonAllergies.map((allergy) => (
                      <div key={allergy} className="flex items-center space-x-2">
                        <Checkbox
                          id={allergy}
                          checked={data.dietary.allergies.includes(allergy)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateData('dietary', 'allergies', [...data.dietary.allergies, allergy]);
                            } else {
                              updateData('dietary', 'allergies', data.dietary.allergies.filter(a => a !== allergy));
                            }
                          }}
                        />
                        <Label htmlFor={allergy} className="text-sm text-gray-700">{allergy}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">Favorite cuisines?</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {cuisineOptions.map((cuisine) => (
                      <div key={cuisine} className="flex items-center space-x-2">
                        <Checkbox
                          id={cuisine}
                          checked={data.dietary.cuisines.includes(cuisine)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateData('dietary', 'cuisines', [...data.dietary.cuisines, cuisine]);
                            } else {
                              updateData('dietary', 'cuisines', data.dietary.cuisines.filter(c => c !== cuisine));
                            }
                          }}
                        />
                        <Label htmlFor={cuisine} className="text-sm text-gray-700">{cuisine}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="dietary-restrictions" className="text-sm font-medium text-gray-700">Any other dietary preferences?</Label>
                  <Textarea
                    id="dietary-restrictions"
                    placeholder="e.g., vegetarian, vegan, keto, low-sodium..."
                    value={data.dietary.dietaryRestrictions}
                    onChange={(e) => updateData('dietary', 'dietaryRestrictions', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Lifestyle */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Activity Level</Label>
                  <Select value={data.lifestyle.activityLevel} onValueChange={(value) => updateData('lifestyle', 'activityLevel', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="How active are you?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary (desk job, little exercise)</SelectItem>
                      <SelectItem value="lightly-active">Lightly Active (light exercise 1-3 days/week)</SelectItem>
                      <SelectItem value="moderately-active">Moderately Active (moderate exercise 3-5 days/week)</SelectItem>
                      <SelectItem value="very-active">Very Active (hard exercise 6-7 days/week)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Meals per day</Label>
                    <Select value={data.lifestyle.mealsPerDay} onValueChange={(value) => updateData('lifestyle', 'mealsPerDay', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="How many?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 meals</SelectItem>
                        <SelectItem value="4">3 meals + 1 snack</SelectItem>
                        <SelectItem value="5">3 meals + 2 snacks</SelectItem>
                        <SelectItem value="6">6 small meals</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Cooking time</Label>
                    <Select value={data.lifestyle.cookingTime} onValueChange={(value) => updateData('lifestyle', 'cookingTime', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Time available?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15-min">15 minutes or less</SelectItem>
                        <SelectItem value="30-min">30 minutes</SelectItem>
                        <SelectItem value="60-min">1 hour</SelectItem>
                        <SelectItem value="flexible">I'm flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Weekly food budget</Label>
                  <Select value={data.lifestyle.budget} onValueChange={(value) => updateData('lifestyle', 'budget', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="What's your budget?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="budget">Budget-friendly ($50-75)</SelectItem>
                      <SelectItem value="moderate">Moderate ($75-125)</SelectItem>
                      <SelectItem value="flexible">Flexible ($125+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 flex items-center"
              >
                {currentStep === totalSteps ? 'Complete Setup' : 'Next'}
                {currentStep < totalSteps && <ArrowRight className="h-4 w-4 ml-2" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingFlow;
