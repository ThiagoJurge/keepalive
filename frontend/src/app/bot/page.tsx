"use client"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export default function QrCodePage() {
    const [qrData, setQrData] = useState<string | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const [loading, setLoading] = useState(true)

    const fetchStatusAndQr = async () => {
        try {
            const res = await fetch("http://localhost:3001/qr")
            const data = await res.json()

            if (data.status === "authenticated") {
                setIsConnected(true)
                setQrData(null)
            } else if (data.status === "qr") {
                setIsConnected(false)
                setQrData(data.qr)
            } else {
                setIsConnected(false)
                setQrData(null)
            }

            setLoading(false)
        } catch (err) {
            console.error("Erro ao buscar status/QR:", err)
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStatusAndQr()

        const interval = setInterval(() => {
            fetchStatusAndQr()
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        WhatsApp Connection
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {loading
                            ? "Checking connection status..."
                            : isConnected
                                ? "Manage your WhatsApp connection"
                                : "Authenticate with QR code"}
                    </p>
                </div>

                <div className="rounded-xl border bg-background p-6 shadow-sm transition-all hover:shadow-md">
                    {loading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-1/2 mx-auto" />
                            <Skeleton className="h-64 w-full rounded-lg" />
                            <Skeleton className="h-4 w-3/4 mx-auto" />
                        </div>
                    ) : isConnected ? (
                        <div className="flex flex-col items-center space-y-4">
                            <Badge className="px-4 py-2 text-sm font-medium">
                                ✅ Connected successfully
                            </Badge>
                            <div className="text-center space-y-2">
                                <p className="text-foreground">
                                    WhatsApp is connected to the client
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    You can now send and receive messages
                                </p>
                            </div>
                            <Button variant="outline" onClick={fetchStatusAndQr}>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Refresh status
                            </Button>
                        </div>
                    ) : qrData ? (
                        <div className="flex flex-col items-center space-y-6">
                            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
                                🔄 Waiting for connection
                            </Badge>
                            <div className="text-center space-y-1">
                                <p className="text-foreground">
                                    Scan the QR code below
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Use WhatsApp on your phone to authenticate
                                </p>
                            </div>
                            <img
                                src={qrData}
                                alt="QR Code"
                                className="rounded-lg border p-4 shadow-inner w-full max-w-xs"
                            />
                            <Button variant="outline" onClick={fetchStatusAndQr}>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Generate new QR code
                            </Button>
                        </div>
                    ) : (
                        <div className="text-center">
                            <p className="text-muted-foreground">
                                Loading QR code...
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}