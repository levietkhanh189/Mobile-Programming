import { Order } from './api';

export interface OrderAnalyticsSummary {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  deliveredRate: number;
}

export interface ProductSalesStat {
  productId: number;
  name: string;
  quantitySold: number;
  revenue: number;
}

const roundCurrency = (value: number): number => {
  return Math.round(value * 100) / 100;
};

export const calculateOrderSummary = (orders: Order[]): OrderAnalyticsSummary => {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const deliveredOrders = orders.filter((order) => order.status === 'Delivered').length;

  return {
    totalOrders,
    totalRevenue: roundCurrency(totalRevenue),
    averageOrderValue: totalOrders > 0 ? roundCurrency(totalRevenue / totalOrders) : 0,
    deliveredRate: totalOrders > 0 ? roundCurrency((deliveredOrders / totalOrders) * 100) : 0,
  };
};

export const getTopSellingProducts = (
  orders: Order[],
  limit: number = 5
): ProductSalesStat[] => {
  const productMap = new Map<number, ProductSalesStat>();

  for (const order of orders) {
    for (const item of order.items) {
      const current = productMap.get(item.productId);

      if (!current) {
        productMap.set(item.productId, {
          productId: item.productId,
          name: item.name,
          quantitySold: item.quantity,
          revenue: roundCurrency(item.price * item.quantity),
        });
        continue;
      }

      current.quantitySold += item.quantity;
      current.revenue = roundCurrency(current.revenue + item.price * item.quantity);
    }
  }

  return [...productMap.values()]
    .sort((a, b) => b.quantitySold - a.quantitySold || b.revenue - a.revenue)
    .slice(0, limit);
};

export const groupOrdersByStatus = (orders: Order[]): Record<Order['status'], number> => {
  const result: Record<Order['status'], number> = {
    Pending: 0,
    Confirmed: 0,
    Processing: 0,
    Shipping: 0,
    Delivered: 0,
    Cancelled: 0,
  };

  for (const order of orders) {
    result[order.status] += 1;
  }

  return result;
};
