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
import { toast } from "sonner";
import type { TuserProfile } from "@/types/userData";
import ProfileUpload from "@/components/profileUpload";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  first_name: z.string().min(2).max(250),
  last_name: z.string().min(2).max(250),
  phone_number: z.string().min(11).max(11),
  email: z.email({
    pattern:
      /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i,
  }),
  address: z.string().min(2).max(250),
  business_name: z.string().min(2).max(250),
});

type LandlordEditProfileProps = {
  userData: TuserProfile;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function LandlordEditProfile({
  userData,
  setState,
}: LandlordEditProfileProps) {
  const { session } = useAuthContext();

  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: userData.userData.first_name,
      last_name: userData.userData.last_name,
      phone_number: userData.userData.phone_number,
      address: userData.userData.address,
      business_name: userData.userData.business_name,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/rent-ease/api/edit-landlord-profile`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          id: session.user.id,
          img: image ? image : "",
          first_name: values.first_name,
          last_name: values.last_name,
          phone_number: values.phone_number,
          address: values.address,
          business_name: values.business_name,
        }),
      }
    );

    const json = await response.json();

    if (!response.ok) {
      setLoading(false);
      return toast.error(
        json.message || "Ops, something went wrong. Please try again."
      );
    }

    console.log(json);
    setLoading(false);
    toast.success(json.message);
  }

  return (
    <div>
      <div className="text-gray-900 flex justify-center items-center p-4 mb-4">
        <h1 className="text-xl font-bold">Edit Profile</h1>
      </div>
      <Form {...form}>
        <ProfileUpload setProfile={setImage} />

        <form className="p-4 space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="First Name"
                    className="border-gray-900"
                    disabled={loading}
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
                    {...field}
                    placeholder="Last Name"
                    className="border-gray-900"
                    disabled={loading}
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
                    {...field}
                    placeholder="Phone Number"
                    className="border-gray-900"
                    disabled={loading}
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Address"
                    className="border-gray-900"
                    disabled={loading}
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
                <FormLabel>Business Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Business Name"
                    className="border-gray-900"
                    disabled={loading}
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant={"secondary"}
              onClick={() => setState((prev) => !prev)}
              className="w-20 text-gray-900"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" className="w-20 bg-green-700">
              {loading ? (
                <Loader2 size={25} className="animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
