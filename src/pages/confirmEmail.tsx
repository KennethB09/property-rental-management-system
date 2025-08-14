import svg from "@/assets/svgs/undraw_mail-sent_ujev.svg";

export default function ConfirmEmail() {
    return (
        <div className="h-screen flex flex-col justify-center content-center">
            <div className="flex flex-col justify-center items-center gap-3">
                <img src={svg} className="size-40"/>
                <p className="text-gray-900 font-semibold text-center">Verification sent to your email. <br /> Please, check your inbox.</p>
            </div>
        </div>
    )
}