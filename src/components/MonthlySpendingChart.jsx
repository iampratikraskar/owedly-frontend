import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

const MonthlySpendingChart = ({ data = [] }) => {

    const chartData = data.map((item) => ({
        month: item.month,
        amount: Number(item.amount || 0),
    }));

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

            <div className="mb-5">
                <h2 className="text-lg font-semibold text-gray-900">
                    Monthly Spending
                </h2>

                <p className="text-sm text-gray-500">
                    Track how your spending changes over time.
                </p>
            </div>

            {chartData.length === 0 ? (
                <div className="flex h-72 items-center justify-center text-sm text-gray-500">
                    No monthly spending data available.
                </div>
            ) : (
                <div className="h-72 w-full">

                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >
                        <LineChart
                            data={chartData}
                            margin={{
                                top: 10,
                                right: 20,
                                left: 10,
                                bottom: 10,
                            }}
                        >

                            <CartesianGrid
                                strokeDasharray="3 3"
                            />

                            <XAxis
                                dataKey="month"
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

                            <Line
                                type="monotone"
                                dataKey="amount"
                                strokeWidth={3}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                            />

                        </LineChart>
                    </ResponsiveContainer>

                </div>
            )}

        </div>
    );
};

export default MonthlySpendingChart;