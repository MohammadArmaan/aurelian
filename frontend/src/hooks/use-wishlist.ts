import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type WishlistItem } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export function useWishlist() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ["wishlist"],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await api.get<{ items: WishlistItem[] } | WishlistItem[]>("/wishlist");
      return Array.isArray(data) ? data : data.items || [];
    },
  });

  const add = useMutation({
    mutationFn: async (productId: string) => (await api.post("/wishlist", { productId })).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["wishlist"] }); toast.success("Saved to wishlist"); },
    onError: (e: any) => toast.error(e?.response?.data?.message || "Could not save"),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => api.delete(`/wishlist/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["wishlist"] }); toast.success("Removed"); },
  });

  const items = q.data ?? [];
  return { items, count: items.length, isLoading: q.isLoading, add, remove };
}
