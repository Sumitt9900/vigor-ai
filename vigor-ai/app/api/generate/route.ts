import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, goal } = body;

  console.log(`💪 Generating PROTOCOL for: ${name} [Goal: ${goal}]`);

  // Simulate AI Analysis Delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // --- EXERCISE DATABASE ---
  const library: any = {
    // 1. MUSCLE GAIN (Hypertrophy)
    "Muscle Gain": {
      exercises: [
        { 
          name: "Incline Dumbbell Press", 
          reps: "4 sets x 8-12 reps",
          description: "Set bench to 30°. Press dumbbells up, converging at the top but not touching. Focus on the upper chest stretch.",
          video: "https://www.youtube.com/embed/8iPEnn-ltC8?autoplay=0&controls=0&rel=0" 
        },
        { 
          name: "Barbell Back Squat", 
          reps: "4 sets x 8 reps",
          description: "Feet shoulder-width. Break at hips and knees simultaneously. Keep chest up and drive through mid-foot.",
          video: "https://www.youtube.com/embed/swWxW52rTE8?autoplay=0&controls=0&rel=0" 
        },
        { 
          name: "Lat Pulldowns", 
          reps: "3 sets x 12 reps",
          description: "Wide grip. Pull elbows down towards your back pockets. Squeeze lats hard at the bottom.",
          video: "https://www.youtube.com/embed/CAwf7n6Luuc?autoplay=0&controls=0&rel=0" 
        },
        { 
          name: "Romanian Deadlifts", 
          reps: "3 sets x 10 reps",
          description: "Keep legs stiff but not locked. Hinge hips back until you feel a deep stretch in hamstrings.",
          video: "https://www.youtube.com/embed/JCXUYuzwNrM?autoplay=0&controls=0&rel=0" 
        }
      ],
      diet: { breakfast: "Oatmeal & Whey Protein", lunch: "Steak & Rice Bowl", dinner: "Salmon & Sweet Potato" },
      focus: "Hypertrophy & Volume"
    },

    // 2. WEIGHT LOSS (HIIT)
    "Weight Loss": {
      exercises: [
        { 
          name: "Burpees", 
          reps: "4 sets x 15 reps",
          description: "Drop chest to floor, explode up into a jump. Keep pace high to spike heart rate.",
          video: "https://www.youtube.com/embed/auBLPXO8Fww?autoplay=0&controls=0&rel=0" 
        },
        { 
          name: "Kettlebell Swings", 
          reps: "4 sets x 20 reps",
          description: "Explosive hip hinge. Do not squat; snap hips forward to float the bell to chest height.",
          video: "https://www.youtube.com/embed/sKpm5tZInuI?autoplay=0&controls=0&rel=0" 
        },
        { 
          name: "Mountain Climbers", 
          reps: "3 sets x 45 seconds",
          description: "High plank position. Drive knees to chest rapidly. Keep core tight and hips low.",
          video: "https://www.youtube.com/embed/nmwgirgXLIg?autoplay=0&controls=0&rel=0" 
        },
        { 
          name: "Jump Rope", 
          reps: "10 mins (Intervals)",
          description: "Light on toes. Use wrists to spin the rope, not arms. 30s ON, 30s OFF.",
          video: "https://www.youtube.com/embed/u3zgHI8QnqE?autoplay=0&controls=0&rel=0" 
        }
      ],
      diet: { breakfast: "Egg White Omelet & Spinach", lunch: "Grilled Chicken Salad", dinner: "White Fish & Asparagus" },
      focus: "Metabolic Conditioning"
    },

    // 3. STRENGTH (Powerlifting)
    "Strength": {
      exercises: [
        { 
          name: "Barbell Deadlift", 
          reps: "5 sets x 3-5 reps",
          description: "Conventional stance. Slack out of the bar. Drive floor away. Heavy load, perfect form.",
          video: "https://www.youtube.com/embed/op9kVnSso6Q?autoplay=0&controls=0&rel=0" 
        },
        { 
          name: "Overhead Press", 
          reps: "5 sets x 5 reps",
          description: "Strict press. Core braced. Press bar in a straight line clearing the head.",
          video: "https://www.youtube.com/embed/QAQ64hK4Xxs?autoplay=0&controls=0&rel=0" 
        },
        { 
          name: "Weighted Pull-ups", 
          reps: "4 sets x 6 reps",
          description: "Full range of motion. Chin over bar. Control the descent.",
          video: "https://www.youtube.com/embed/eGo4IYlbE5g?autoplay=0&controls=0&rel=0" 
        }
      ],
      diet: { breakfast: "3 Eggs & Bagel", lunch: "Beef Pasta", dinner: "Chicken Thighs & Potato" },
      focus: "Max Force Production"
    }
  };

  const selectedPlan = library[goal] || library["Muscle Gain"];

  return NextResponse.json({
    user_profile: { name: name },
    workout_plan: [{ 
      day: "Day 1", 
      focus: selectedPlan.focus, 
      exercises: selectedPlan.exercises 
    }],
    diet_plan: selectedPlan.diet,
    motivation: `Time to crush your ${goal}, ${name}!`
  });
}