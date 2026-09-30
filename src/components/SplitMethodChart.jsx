import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
} from "recharts";

const COLORS = [
    "#4f46e5",
    "#16a34a",
    "#f59e0b",
    "#dc2626",
];

const SplitMethodChart = ({ data = [] }) => {

    const chartData = data.map((item) => ({
        name: item.splitMethod,
        value: Number(item.count ?? item.expenseCount ?? 0),
    }));

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

            <div className="mb-5">
                <h2 className="text-lg font-semibold text-gray-900">
                    Split Methods
                </h2>

                <p className="text-sm text-gray-500">
                    See how expenses are being divided.
                </p>
            </div>

            {chartData.length === 0 ? (
                <div className="flex h-72 items-center justify-center text-sm text-gray-500">
                    No split method data available.
                </div>
            ) : (
                <div className="h-72 w-full">

                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >
                        <PieChart>

                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={90}
                                label
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>

                            <Tooltip />

                            <Legend />

                        </PieChart>
                    </ResponsiveContainer>

                </div>
            )}

        </div>
    );
};

export default SplitMethodChart;