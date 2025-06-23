
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useUserData } from '@/hooks/useUserData';
import { Activity, Moon, Smile } from 'lucide-react';

const HealthDataTracker = () => {
  const [steps, setSteps] = useState('');
  const [sleepHours, setSleepHours] = useState('');
  const [mood, setMood] = useState('');
  const { addHealthData } = useUserData();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await addHealthData({
        steps: steps ? parseInt(steps) : null,
        sleep_hours: sleepHours ? parseFloat(sleepHours) : null,
        mood: mood ? parseInt(mood) : null,
        date: new Date().toISOString().split('T')[0]
      });

      toast({
        title: "✅ Health Data Updated!",
        description: "Your daily health data has been recorded."
      });

      setSteps('');
      setSleepHours('');
      setMood('');
    } catch (error) {
      console.error('Error adding health data:', error);
      toast({
        title: "Error",
        description: "Failed to save health data. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-600" />
          Daily Health Tracker
        </CardTitle>
        <CardDescription>
          Track your daily health metrics for better recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="steps" className="flex items-center gap-1">
                <Activity className="h-4 w-4" />
                Steps
              </Label>
              <Input
                id="steps"
                type="number"
                placeholder="10,000"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="sleep" className="flex items-center gap-1">
                <Moon className="h-4 w-4" />
                Sleep (hrs)
              </Label>
              <Input
                id="sleep"
                type="number"
                step="0.5"
                placeholder="8"
                value={sleepHours}
                onChange={(e) => setSleepHours(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="mood" className="flex items-center gap-1">
                <Smile className="h-4 w-4" />
                Mood (1-10)
              </Label>
              <Input
                id="mood"
                type="number"
                min="1"
                max="10"
                placeholder="7"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
            Update Health Data
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default HealthDataTracker;
