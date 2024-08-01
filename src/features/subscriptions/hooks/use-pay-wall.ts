import { useGetSubscription } from "@/features/subscriptions/api/use-get-subscription";
import { useSubscriptionModal } from "@/features/subscriptions/store/use-subscription-modal";

export const usePayWall = () => {
  const { 
    data: subscription,
    isLoading: isLoadingSubscription
  } = useGetSubscription();

  const subscriptionModal = useSubscriptionModal();

  const shouldBlock = isLoadingSubscription || !subscription?.active;

  return {
    isLoading: isLoadingSubscription,
    shouldBlock,
    triggerPayWall: () => {
      subscriptionModal.onOpen();
    }
  }
}