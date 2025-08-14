import svg from "@/assets/svgs/undraw_best-place_dhzp.svg";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import { useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

const formSchema = z.object({
  email: z.email({
    pattern:
      /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i,
  }),
  password: z.string().min(8),
});

export default function LandlordLogin() {
  const { signIn } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const response = await signIn(values.email, values.password);
    if (!response.success) {
      setLoading(false);
      console.error("Sign-in error:", response.error);
      setErrorMessage(response.error!);
      toast.warning("Log-in Failed", {
        description: "Something went wrong. Please try again.",
        duration: 5000
      });
      return;
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col h-screen px-10 max-sm:px-5 font-roboto">
      <Toaster richColors />
      <div className="flex flex-row h-full">
        <div className="w-5/12 max-sm:w-full text-center h-full flex flex-col justify-center gap-20">
          <h1 className="text-gray-900 font-bold text-4xl">
            Welcome <span className="text-green-700">Back</span>!
          </h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email"
                        {...field}
                        className="border-gray-900"
                        required
                      />
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
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                        className="border-gray-900"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {errorMessage && (
                <p className="text-red-500 font-semibold capitalize">
                  {errorMessage}
                </p>
              )}

              <Button
                type="submit"
                className="w-full bg-green-700 hover:bg-green-900"
                disabled={loading}
              >
                Login
              </Button>
              <p className="text-gray-900">
                Don't have an account?{" "}
                <a href="/auth/landlord-signup" className="text-green-700">
                  Sign-up
                </a>
              </p>
            </form>
          </Form>
        </div>
        <div className="flex justify-center content-center items-center w-full h-full max-sm:hidden">
          <img className=" w-2/3" src={svg} />
        </div>
      </div>
    </div>
  );
}
