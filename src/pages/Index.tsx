import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { CheckSquare, Users, Calendar, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: CheckSquare,
    title: 'Task Management',
    description: 'Create, organize, and track tasks with drag-and-drop Kanban boards',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Work together with real-time chat and task assignments',
  },
  {
    icon: Calendar,
    title: 'Deadline Tracking',
    description: 'Stay on top of deadlines with calendar integration and reminders',
  },
  {
    icon: BarChart3,
    title: 'Progress Analytics',
    description: 'Monitor team productivity with detailed analytics and insights',
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="container mx-auto px-6 py-20">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              TaskForge
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Forge your path to productivity with powerful task management, 
              team collaboration, and deadline tracking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link to="/auth">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                <Link to="/dashboard">View Demo</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-6 py-20">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Everything you need to manage tasks
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              TaskForge provides all the tools your team needs to stay organized, 
              collaborate effectively, and meet deadlines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-colors">
                <CardHeader className="text-center">
                  <feature.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="container mx-auto px-6 py-20">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="text-center space-y-6 p-12">
              <h3 className="text-3xl font-bold">Ready to forge your productivity?</h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands of teams already using TaskForge to streamline their workflow 
                and achieve their goals faster.
              </p>
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link to="/auth">Start Free Trial</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}