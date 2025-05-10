
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Utensils } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

const demoAccounts = [
  { email: "manager@mesa.com", password: "manager123", role: "Menejer" },
  { email: "chef@mesa.com", password: "chef123", role: "Oshpaz" },
  { email: "waiter@mesa.com", password: "waiter123", role: "Ofitsiant" },
];

const Login = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    try {
      await login(values.email, values.password);
      // Navigate is handled in the auth context
    } catch (err) {
      setError("Yaroqsiz elektron pochta yoki parol");
    }
  };

  const loginWithDemo = async (email: string, password: string) => {
    setError(null);
    form.setValue("email", email);
    form.setValue("password", password);
    try {
      await login(email, password);
    } catch (err) {
      setError("Demo hisob qaydnomasi bilan tizimga kirib bo‘lmadi");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <motion.div
            className="w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          >
            <Utensils className="text-white h-8 w-8" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Mesa Order Oasis</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Restoran Boshqaruv Tizimi</p>
        </div>

        <Card className="border-none shadow-xl glass-card">
          <CardHeader>
            <CardTitle className="text-center">Kirish</CardTitle>
            <CardDescription className="text-center">
              Tizimga kirish uchun ma'lumotlaringizni kiriting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} className="border- shadow-md focus:ring-2 focus:ring-teal-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="******" {...field} className="border- shadow-md focus:ring-2 focus:ring-teal-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-2"
                  >
                    {error}
                  </motion.div>
                )}

                <Button type="submit" className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg hover:shadow-teal-500/20" disabled={isLoading}>
                  {isLoading ? <LoadingSpinner /> : "Login"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-gray-500 dark:text-gray-400">
            Demo hisoblar:
            </div>
            <div className="grid grid-cols-3 gap-2 w-full">
              {demoAccounts.map((account) => (
                <Button
                  key={account.email}
                  variant="outline"
                  size="sm"
                  className="text-xs border- shadow-md hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-teal-900/20 dark:hover:text-teal-300"
                  onClick={() => loginWithDemo(account.email, account.password)}
                  disabled={isLoading}
                >
                  {account.role}
                </Button>
              ))}
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
