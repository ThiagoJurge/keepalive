"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

type HostStatusEntry = {
    checked_at: string
    host_id: number
    http_ok: boolean
    icmp_ok: boolean
    port_open: boolean
    id: number
    response_time: number
}

type HostInfo = {
    created_at: string
    id: number
    ip: string
    last_status: {
        checked_at: string
        http_ok: boolean
        icmp_ok: boolean
        port_open: boolean
        response_time: number | null // <- aqui o ajuste
    }
    name: string
    port: number
    url: string
}

type Props = {
    hostId: number
    hostInfo: HostInfo
}

type FormattedChartData = {
    date: number
    icmp_ok: number
    http_ok: number
    port_open: number
    response_time: number
}

type ActiveChartKey = "icmp_ok" | "http_ok" | "port_open" | "response_time"

const chartConfig = {
    views: { label: "Status" },
    icmp_ok: {
        label: "ICMP",
        color: "hsl(var(--chart-1))",
    },
    http_ok: {
        label: "HTTP",
        color: "hsl(var(--chart-2))",
    },
    port_open: {
        label: "Porta",
        color: "hsl(var(--chart-3))",
    },
    response_time: {
        label: "Tempo de Resposta (ms)",
        color: "hsl(var(--chart-4))",
    },
} satisfies ChartConfig

function useHostStatus(hostId: number) {
    const [data, setData] = React.useState<HostStatusEntry[]>([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`http://127.0.0.1:5000/hosts/${hostId}/status`)
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`)
                }
                const json: HostStatusEntry[] = await res.json()
                setData(json.reverse())
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch host status")
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [hostId])

    return { data, isLoading, error }
}

const StatusBadge = ({ status, title }: { status: boolean, title: string }) => (
    <Badge variant={status ? "default" : "destructive"}>
        {title} - {status ? "Online" : "Offline"}
    </Badge>
)

const HostInfoCard = ({ hostInfo, uptimePercentages, averageResponseTime }: {
    hostInfo: HostInfo
    uptimePercentages: {
        icmp: string
        http: string
        port: string
    }
    averageResponseTime: string
}) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center justify-between">
                <div>
                    {hostInfo.name} <span className="text-muted-foreground">({hostInfo.ip})</span>
                </div>
                <div className="flex gap-2">
                    <StatusBadge status={hostInfo.last_status.icmp_ok} title="ICMP" />
                    <StatusBadge status={hostInfo.last_status.http_ok} title="HTTP" />
                </div>
            </CardTitle>
            <CardDescription>
                Monitorando desde {new Date(hostInfo.created_at).toLocaleDateString('pt-BR')}
                <br />
                URL: <a href={hostInfo.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {hostInfo.url}
                </a>
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                    <h3 className="text-sm font-medium">Disponibilidade ICMP</h3>
                    <p className="text-2xl font-bold">{uptimePercentages.icmp}</p>
                </div>
                <div className="space-y-2">
                    <h3 className="text-sm font-medium">Disponibilidade HTTP</h3>
                    <p className="text-2xl font-bold">{uptimePercentages.http}</p>
                </div>
                <div className="space-y-2">
                    <h3 className="text-sm font-medium">Tempo médio de resposta</h3>
                    <p className="text-2xl font-bold">{averageResponseTime} ms</p>
                </div>
            </div>
        </CardContent>
    </Card>
)

const RecentEvents = ({ data }: { data: HostStatusEntry[] }) => (
    <Card>
        <CardHeader>
            <CardTitle>Eventos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                {data.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between border-b pb-2">
                        <div>
                            <p className="font-medium">
                                {new Date(entry.checked_at).toLocaleString('pt-BR')}
                            </p>
                            <div className="flex gap-2 text-sm text-muted-foreground">
                                <span>ICMP: {entry.icmp_ok ? '✔️' : '❌'}</span>
                                <span>HTTP: {entry.http_ok ? '✔️' : '❌'}</span>
                                <span>Porta: {entry.port_open ? '✔️' : '❌'}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-mono">{(entry.response_time * 1000).toFixed(2)}ms</p>
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
)

export function HostChart({ hostId, hostInfo }: Props) {
    const { data, isLoading, error } = useHostStatus(hostId)
    const [activeChart, setActiveChart] = React.useState<ActiveChartKey>("icmp_ok")

    const formattedChartData = React.useMemo<FormattedChartData[]>(() => {
        return data.map((entry) => ({
            date: new Date(entry.checked_at).getTime(),
            icmp_ok: entry.icmp_ok ? 1 : 0,
            http_ok: entry.http_ok ? 1 : 0,
            port_open: entry.port_open ? 1 : 0,
            response_time: entry.response_time * 1000,
        }))
    }, [data])

    const uptimePercentages = React.useMemo(() => {
        const calculate = (metric: 'http_ok' | 'icmp_ok' | 'port_open') => {
            if (data.length === 0) return "0%"
            const upCount = data.filter(entry => entry[metric]).length
            return `${((upCount / data.length) * 100).toFixed(1)}%`
        }

        return {
            icmp: calculate('icmp_ok'),
            http: calculate('http_ok'),
            port: calculate('port_open'),
        }
    }, [data])

    const averageResponseTime = React.useMemo(() => {
        if (data.length === 0) return "0.00"
        const total = data.reduce((acc, curr) => acc + curr.response_time, 0)
        return (total / data.length * 1000).toFixed(2)
    }, [data])

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center text-destructive">
                    <p>Erro ao carregar dados do host</p>
                    <p className="text-sm text-muted-foreground">{error}</p>
                </div>
            </div>
        )
    }

    if (!isLoading && data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <p>Nenhum dado de status disponível para este host</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <HostInfoCard
                hostInfo={hostInfo}
                uptimePercentages={uptimePercentages}
                averageResponseTime={averageResponseTime}
            />

            {/* Status Chart */}
            <Card>
                <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                    <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                        <CardTitle>Histórico de Status</CardTitle>
                    </div>
                    <div className="flex">
                        {Object.keys(chartConfig)
                            .filter((key): key is ActiveChartKey => key !== 'views')
                            .map((key) => {
                                const metricData = formattedChartData.map(d => d[key])
                                const average = metricData.reduce((a, b) => a + b, 0) / metricData.length || 0
                                const displayValue = key === "response_time"
                                    ? `${average.toFixed(2)} ms`
                                    : `${(average * 100).toFixed(0)}%`

                                return (
                                    <button
                                        key={key}
                                        data-active={activeChart === key}
                                        className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                                        onClick={() => setActiveChart(key)}
                                    >
                                        <span className="text-xs text-muted-foreground">
                                            {chartConfig[key].label}
                                        </span>
                                        <span className="text-lg font-bold leading-none sm:text-2xl">
                                            {displayValue}
                                        </span>
                                    </button>
                                )
                            })}
                    </div>
                </CardHeader>
                <CardContent className="px-2 sm:p-6">
                    {isLoading ? (
                        <div className="flex h-[250px] items-center justify-center">
                            <p>Carregando dados...</p>
                        </div>
                    ) : (
                        <ChartContainer
                            config={chartConfig}
                            className="aspect-auto h-[250px] w-full"
                        >
                            <LineChart
                                data={formattedChartData}
                                margin={{
                                    left: 12,
                                    right: 12,
                                    top: 12,
                                    bottom: 12,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(value) => new Date(value).toLocaleTimeString('pt-BR')}
                                    tickMargin={8}
                                    minTickGap={30}
                                />
                                <YAxis
                                    domain={activeChart === 'response_time' ? [0, 'auto'] : [0, 1]}
                                    tickFormatter={value => activeChart === 'response_time' ? `${value} ms` : value}
                                />
                                <Tooltip
                                    labelFormatter={(value) => new Date(value).toLocaleString('pt-BR')}
                                    formatter={(value) => activeChart === 'response_time'
                                        ? [`${value} ms`, chartConfig[activeChart].label]
                                        : [value ? 'Online' : 'Offline', chartConfig[activeChart].label]}
                                />
                                <Line
                                    type="monotone"
                                    dataKey={activeChart}
                                    stroke={chartConfig[activeChart].color}
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ChartContainer>
                    )}
                </CardContent>
            </Card>

            <RecentEvents data={data} />
        </div>
    )
}