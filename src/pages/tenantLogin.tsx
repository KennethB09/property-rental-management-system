import AuthPageNav from "@/components/authPageNav";
import svg from "../assets/svgs/undraw_house-searching_g2b8.svg";
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

const formSchema = z.object({
  email: z.email({
    pattern:
      /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i,
  }),
  password: z.string().min(8),
});

export default function TenantLogin() {
  const { signIn } = useAuthContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const response = signIn(values.email, values.password);
    // if (!response.response.ok) {
    //   console.log(response)
    //   // toast({
    // //   title: "Ops, something went wrong",
    // //   description: `${response.json.error}`,
    // //   variant: "destructive",
    // // });
    // }

    console.log(response)
  }

  return (
    <div className="flex flex-col h-screen px-10 font-roboto">
      <AuthPageNav />
      <div className="flex flex-row h-full">
        <div className="w-5/12 text-center h-full flex flex-col justify-center gap-20">
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
                      <Input type="email" placeholder="Email" {...field} required/>
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
                      <Input type="password" placeholder="Password" {...field} required/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-green-700 hover:bg-green-900">Login</Button>
              <p className="text-gray-900">Don't have an account? <a href="/auth/tenant-signup" className="text-green-700">Sign-up</a></p>
            </form>
          </Form>
        </div>
        <div className="flex justify-center content-center items-center w-full h-full">
          <img className=" w-4/5" src={svg} />
        </div>
      </div>
    </div>
  );
}
