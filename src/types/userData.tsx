export type TuserProfile = {
  userData: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    address: string;
    business_name: string;
  };
  userProfile: [{ name: string }];
};
