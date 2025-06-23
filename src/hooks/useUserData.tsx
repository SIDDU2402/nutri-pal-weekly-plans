
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  age: number | null;
  gender: string | null;
  weight: number | null;
  height: number | null;
  dietary_goals: string | null;
  allergies: string[] | null;
  preferred_cuisines: string[] | null;
  activity_level: string | null;
}

interface HealthData {
  id: string;
  user_id: string;
  steps: number | null;
  sleep_hours: number | null;
  mood: number | null;
  date: string;
}

interface MealPlan {
  id: string;
  user_id: string;
  week_start_date: string;
  meals: any;
  grocery_list: any;
}

export const useUserData = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [healthData, setHealthData] = useState<HealthData[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const subscriptionsRef = useRef<any[]>([]);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setHealthData([]);
      setMealPlans([]);
      setLoading(false);
      return;
    }

    fetchUserData();
    setupRealtimeSubscriptions();
    
    return () => {
      console.log('Cleaning up realtime subscriptions');
      subscriptionsRef.current.forEach(channel => {
        supabase.removeChannel(channel);
      });
      subscriptionsRef.current = [];
    };
  }, [user?.id]); // Only depend on user ID to prevent unnecessary re-runs

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(profileData);

      // Fetch health data
      const { data: healthData } = await supabase
        .from('health_data')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      setHealthData(healthData || []);

      // Fetch meal plans
      const { data: mealPlansData } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setMealPlans(mealPlansData || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscriptions = () => {
    if (!user || subscriptionsRef.current.length > 0) return;

    console.log('Setting up realtime subscriptions for user:', user.id);

    // Subscribe to profile changes
    const profileChannel = supabase
      .channel(`profiles-${user.id}-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`
        },
        (payload) => {
          console.log('Profile change received:', payload);
          if (payload.eventType === 'UPDATE') {
            setProfile(payload.new as Profile);
          }
        }
      )
      .subscribe();

    // Subscribe to health data changes
    const healthChannel = supabase
      .channel(`health-data-${user.id}-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'health_data',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Health data change received:', payload);
          if (payload.eventType === 'INSERT') {
            setHealthData(prev => [payload.new as HealthData, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setHealthData(prev => prev.map(item => 
              item.id === payload.new.id ? payload.new as HealthData : item
            ));
          }
        }
      )
      .subscribe();

    // Subscribe to meal plans changes
    const mealPlansChannel = supabase
      .channel(`meal-plans-${user.id}-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'meal_plans',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Meal plans change received:', payload);
          if (payload.eventType === 'INSERT') {
            setMealPlans(prev => [payload.new as MealPlan, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setMealPlans(prev => prev.map(item => 
              item.id === payload.new.id ? payload.new as MealPlan : item
            ));
          }
        }
      )
      .subscribe();

    subscriptionsRef.current = [profileChannel, healthChannel, mealPlansChannel];
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const addHealthData = async (data: Omit<HealthData, 'id' | 'user_id'>) => {
    if (!user) return;

    const { error } = await supabase
      .from('health_data')
      .insert([{ ...data, user_id: user.id }]);

    if (error) {
      console.error('Error adding health data:', error);
      throw error;
    }
  };

  return {
    profile,
    healthData,
    mealPlans,
    loading,
    updateProfile,
    addHealthData,
    refetch: fetchUserData
  };
};
