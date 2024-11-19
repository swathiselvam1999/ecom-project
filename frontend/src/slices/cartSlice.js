import { CART_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const cartApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCart: builder.query({
            query: () => ({
                url: `${CART_URL}/`,
                credentials: 'include',
            }),
            providesTags: ['Cart'],
        }),
        addToCart: builder.mutation({
            query: ({ productId, qty }) => ({
                url: CART_URL,
                method: "POST",
                body: { productId, qty },
            }),
            invalidatesTags: ['Cart'],
        }),
        removeFromCart: builder.mutation({
            query: ({ productId }) => ({
                url: CART_URL,
                method: "DELETE",
                body: { productId },
            }),
            invalidatesTags: ['Cart'],
        }),
        updateCart: builder.mutation({
            query: ({ productId, qty }) => ({
                url: CART_URL,
                method: "PUT",
                body: { productId, qty },
            }),
            invalidatesTags: ['Cart'],
        }),
    }),
});

export const {
    useGetCartQuery,
    useAddToCartMutation,
    useRemoveFromCartMutation,
    useUpdateCartMutation
} = cartApiSlice;

