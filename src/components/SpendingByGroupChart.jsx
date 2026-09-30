import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

const SpendingByGroupChart = ({ data = [] }) => {

    const chartData = data.map((item) => ({
        name: item.groupName,
        spending: Number(
            item.totalSpending ??
            item.amount ??
            item.totalAmount ??
            0
        ),
    }));

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

            <div className="mb-5">
                <h2 className="text-lg font-semibold text-gray-900">
                    Spending by Group
                </h2>

                <p className="text-sm text-gray-500">
                    Compare your spending across groups.
                </p>
            </div>

            {chartData.length === 0 ? (
                <div className="flex h-72 items-center justify-center text-sm text-gray-500">
                    No group spending data available.
                </div>
            ) : (
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{
                                top: 10,
                                right: 20,
                                left: 10,
                                bottom: 10,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 12 }}
                            />

                            <YAxis
                                tick={{ fontSize: 12 }}
                            />

                            <Tooltip
                                formatter={(value) => [
                                    `₹${Number(value).toFixed(2)}`,
                                    "Spending",
                                ]}
                            />

                            <Bar
                                dataKey="spending"
                                radius={[6, 6, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

        </div>
    );
};

export default SpendingByGroupChart;