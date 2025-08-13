import { getPaymentStatusInfo } from "@/utils/bookingUtils";
import { DollarSign } from "lucide-react";

const getPaymentBadge = (isPaid: boolean) => {
    const paymentInfo = getPaymentStatusInfo(isPaid);

    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${paymentInfo.bgColor} ${paymentInfo.textColor} border-current/20`}
        >
            <DollarSign className='w-3 h-3 mr-1' />
            {paymentInfo.text}
        </span>
    );
};

export default getPaymentBadge