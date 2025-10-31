import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import { useState } from "react";
import ProfileUpload from "./profileUpload";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

export type Timage = {
  dataURL: string;
  file: File | undefined;
};

type ProfileSetupFormProps = {
  setClose: React.Dispatch<React.SetStateAction<boolean>>;
};

const formSchema = z.object({
  address: z.string().min(1).max(250),
  business_name: z.string().min(1).max(250),
  phone_number: z.string().min(11).max(11),
});

export default function ProfileSetupForm({ setClose }: ProfileSetupFormProps) {
  const { landlordAccountSetup } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<string | null>(null);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    if (!profile) {
      setLoading(false);
      return toast.warning("Choose a profile picture.")
    }

    const response = await landlordAccountSetup(
      profile,
      values.address,
      values.business_name,
      values.phone_number
    );

    if (!response.success) {
      setLoading(false);
      return toast.error(response.error);
    }

    toast.success("Profile set-up completed", {
      description: "Your account is fully set-up.",
      duration: 5000,
    });

    setLoading(false);
    setClose(false);
    localStorage.setItem("activeTab", "true");
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      business_name: "",
      phone_number: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 px-4 font-roboto"
      >
        <div className="my-4">
          <ProfileUpload setProfile={setProfile} />
        </div>
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-900 font-roboto font-semibold">
                Address
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="address"
                  placeholder="Address"
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
          name="business_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-900 font-roboto font-semibold">
                Business Name
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Business Name"
                  className="border-gray-900"
                  required
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-900 font-roboto font-semibold">
                Phone Number
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Phone Number"
                  className="border-gray-900"
                  required
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="bg-green-700 hover:bg-green-900 font-roboto w-full"
          disabled={loading}
        >
          {loading ? <Loader2Icon className="animate-spin" /> : "Save changes"}
        </Button>
      </form>
    </Form>
  );
}
