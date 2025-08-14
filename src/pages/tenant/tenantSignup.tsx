import svg from "@/assets/svgs/undraw_location-search_nesh.svg";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthContext } from "@/context/AuthContext";
import { useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useNavigate } from "react-router";

const formSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  phone_number: z.string(),
  occupation: z.string(),
  email: z.email({
    pattern:
      /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i,
  }),
  password: z.string().min(8),
});

export default function TenantSignup() {
  const navigate = useNavigate();
  const { signUp } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone_number: "",
      occupation: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const response = await signUp(
      values.email,
      values.password,
      values.first_name,
      values.last_name,
      values.phone_number,
      values.occupation,
      "tenant"
    );
    if (!response.success) {
      setLoading(false);
      console.error("Sign-up error:", response.error);
      setErrorMessage(response.error!);
      toast.warning("Sign-up Failed", {
        description: "Please try again.",
      });
      return;
    }
    if (!response.data.session) {
      if (response.data.user.role === "") {
        toast.info("Sign-up Failed", {
          description: "This email is already used.",
          duration: 5000
        });
        setLoading(false);
        return;
      }
      navigate("/email-verification");
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col px-10 max-sm:px-5 font-roboto">
      <Toaster richColors />
      <div className="flex flex-row">
        <div className="w-5/12 max-sm:w-full h-full flex flex-col justify-center gap-10 my-10">
          <h1 className="text-gray-900 font-bold text-3xl">Sign-up</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="First Name"
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
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Last Name"
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
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Phone Number"
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
                name="occupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occupation</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                        required
                      >
                        <SelectTrigger
                          className="w-full border-gray-900"
                          iconColor="#101828"
                        >
                          <SelectValue placeholder="Occupation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="employed">Employed</SelectItem>
                          <SelectItem value="self-employed">
                            Self-employed
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                Sign-up
              </Button>
              <p className="text-gray-900 text-center">
                Already have an account?{" "}
                <a href="/auth/tenant-login" className="text-green-700">
                  Login
                </a>
              </p>
            </form>
          </Form>
        </div>
        <div className="flex justify-center items-center w-full max-sm:hidden">
          <img className=" w-2/3" src={svg} />
        </div>
      </div>
    </div>
  );
}
