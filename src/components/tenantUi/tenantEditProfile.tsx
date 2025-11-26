import { X } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "sonner";
import ProfileUpload from "@/components/profileUpload";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import type { tenant } from "@/types/interface";
import type { occupation } from "@/types/appData";
import { useApi } from "@/context/ApiContext";

const formSchema = z.object({
  first_name: z.string().min(2).max(250),
  last_name: z.string().min(2).max(250),
  phone_number: z.string().min(11).max(11),
  occupation: z.string(),
});

type TenantEditProfileProps = {
  userData: tenant;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function TenantEditProfile({
  userData,
  setState,
}: TenantEditProfileProps) {
  const { session } = useAuthContext();
  const { getOccupantType } = useApi();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [occupantion, setOccupantion] = useState<occupation[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: userData.first_name,
      last_name: userData.last_name,
      phone_number: userData.phone_number,
      occupation: userData.occupation.id.toString(),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    const response = await fetch(
      `${import.meta.env.VITE_SERVER_URL}/rent-ease/api/edit-tenant-profile`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          path: userData.profile_pic,
          id: session.user.id,
          img: image ? image : "",
          first_name: values.first_name,
          last_name: values.last_name,
          phone_number: values.phone_number,
          occupation: values.occupation,
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

    // console.log(json);
    setLoading(false);
    toast.success(json.message);
    form.reset();
    setState(false);
  }

  useEffect(() => {
    async function getOccupantion() {
      const occupantType = await getOccupantType();

      if (occupantType.error) {
        return toast.error(occupantType.error);
      }

      setOccupantion(occupantType.data!);
    }

    getOccupantion();
  }, []);

  return (
    <div className="fixed w-full h-screen bg-white dark:bg-gray-900 lg:absolute lg:h-full lg:w-full lg:flex lg:flex-col">
      <div className="flex justify-between items-center h-16 px-4 lg:p-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Edit Profile</h1>
        <button onClick={() => setState(false)}>
          <X size={30} />
        </button>
      </div>

      <Form {...form}>
        <form
          className="p-4 space-y-3 h-full overflow-y-scroll"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <ProfileUpload setProfile={setImage} />
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
                    disabled={loading}
                    required
                  >
                    <SelectTrigger
                      className="w-full border-gray-900 capitalize"
                      iconColor="#101828"
                    >
                      <SelectValue placeholder="Occupation" />
                    </SelectTrigger>
                    <SelectContent>
                      {occupantion.map((item) => (
                        <SelectItem
                          key={item.id}
                          value={item.id.toString()}
                          className="capitalize"
                        >
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant={"secondary"}
              onClick={() => setState((prev) => !prev)}
              className="w-20 text-gray-900 dark:text-slate-100 dark:bg-gray-700"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" className="w-20 bg-green-700 hover:bg-green-900 text-slate-100">
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
