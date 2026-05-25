import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type CartItem } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export function useCart() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const cart = useQuery({
    queryKey: ["cart"],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await api.get<{ items: CartItem[] } | CartItem[]>("/cart");
      return Array.isArray(data) ? data : data.items || [];
    },
  });

  const add = useMutation({
    mutationFn: async (vars: { productId: string; quantity?: number }) => {
      const { data } = await api.post("/cart", { productId: vars.productId, quantity: vars.quantity ?? 1 });
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["cart"] }); toast.success("Added to cart"); },
    onError: (e: any) => toast.error(e?.response?.data?.message || "Could not add to cart"),
  });

  const update = useMutation({
    mutationFn: async (vars: { id: string; quantity: number }) => {
      const { data } = await api.put(`/cart/${vars.id}`, { quantity: vars.quantity });
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => api.delete(`/cart/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["cart"] }); toast.success("Removed from cart"); },
  });

  const items = cart.data ?? [];
  const count = items.reduce((s, i) => s + (i.quantity || 1), 0);
  const subtotal = items.reduce((s, i) => s + (i.product?.price || 0) * (i.quantity || 1), 0);

  return { items, count, subtotal, isLoading: cart.isLoading, add, update, remove };
}
