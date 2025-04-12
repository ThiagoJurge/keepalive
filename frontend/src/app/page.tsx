// app/components/HostTable.tsx
"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCw, ExternalLink, Server, Globe, Wifi, Network, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { HostChart } from "@/components/host-chart"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

type Host = {
  id: number
  name: string
  ip: string
  url: string
  port: number
  created_at: string
  last_status: {
    checked_at: string
    http_ok: boolean
    icmp_ok: boolean
    port_open: boolean
    response_time: number | null
  }
}

export default function HostTable() {
  const [hosts, setHosts] = useState<Host[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchHosts = async () => {
    setLoading(true)
    try {
      const res = await fetch("http://127.0.0.1:5000/hosts")
      const data = await res.json()
      setHosts(data)
      setLastUpdate(new Date())
    } catch (err) {
      console.error("Erro ao buscar hosts:", err)
      setHosts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHosts()
    const interval = setInterval(fetchHosts, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="rounded-xl bg-transparent shadow-sm border-transparent">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Monitoramento de Hosts
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Status em tempo real dos serviços
            </p>
          </div>
          <div className="flex items-center gap-2">
            {lastUpdate && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Atualizado: {lastUpdate.toLocaleTimeString()}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchHosts}
              disabled={loading}
              className="h-8 w-8 p-0 rounded-full"
            >
              <motion.div
                animate={{ rotate: loading ? 360 : 0 }}
                transition={{ repeat: loading ? Infinity : 0, duration: 1, ease: "linear" }}
              >
                <RefreshCw size={16} className={loading ? "text-blue-500" : "text-gray-500 dark:text-gray-400"} />
              </motion.div>
            </Button>
          </div>
        </div>

        <div className="overflow-auto rounded-lg">
          <Table className="min-w-[1100px]">
            <TableHeader className="border-b border-gray-100 dark:border-zinc-800">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-medium text-gray-500 dark:text-gray-400 pl-0">Nome</TableHead>
                <TableHead className="font-medium text-gray-500 dark:text-gray-400">IP</TableHead>
                <TableHead className="font-medium text-gray-500 dark:text-gray-400">URL</TableHead>
                <TableHead className="font-medium text-gray-500 dark:text-gray-400">Porta</TableHead>
                <TableHead className="font-medium text-gray-500 dark:text-gray-400"></TableHead>
                <TableHead className="font-medium text-gray-500 dark:text-gray-400">ICMP</TableHead>
                <TableHead className="font-medium text-gray-500 dark:text-gray-400">HTTP</TableHead>
                <TableHead className="font-medium text-gray-500 dark:text-gray-400">Latência</TableHead>
                <TableHead className="font-medium text-gray-500 dark:text-gray-400 pr-0 text-right">Última Verificação</TableHead>
                <TableHead className="font-medium text-gray-500 dark:text-gray-400 pr-0 text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!hosts ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-b border-gray-100 dark:border-zinc-800">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <TableCell key={j} className={j === 7 ? "pr-0 text-right" : ""}>
                        <Skeleton className="h-4 w-full rounded-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : hosts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-gray-500 dark:text-gray-400 py-8">
                    Nenhum host configurado para monitoramento
                  </TableCell>
                </TableRow>
              ) : (
                hosts.map((host) => (
                  <TableRow key={host.id} className="border-b border-gray-100 dark:border-zinc-800 hover:bg-gray-50/50 dark:hover:bg-zinc-800/30">
                    {/* Nome */}
                    <TableCell className="pl-0">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                          <Server size={16} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {host.name}
                        </span>
                      </div>
                    </TableCell>

                    {/* IP */}
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs px-2 py-0.5">
                        {host.ip}
                      </Badge>
                    </TableCell>

                    {/* URL */}
                    <TableCell>
                      <a
                        href={host.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1 dark:text-blue-400"
                      >
                        {host.url.replace(/^https?:\/\//, '')}
                        <ExternalLink size={12} />
                      </a>
                    </TableCell>

                    {/* Porta */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="px-2 py-0.5 font-mono">
                          {host.port}
                        </Badge>
                      </div>
                    </TableCell>

                    {/* Status da Porta */}

                    <TableCell>

                      <Badge
                        variant={host.last_status.port_open ? "outline" : "destructive"}
                        className="px-2 py-0.5"
                      >
                        <Network size={14} className="mr-1" />
                        {host.last_status.port_open ? "Aberta" : "Fechada"}
                      </Badge>
                    </TableCell>

                    {/* ICMP */}
                    <TableCell>
                      <Badge
                        variant={host.last_status.icmp_ok ? "outline" : "destructive"}
                        className="px-2 py-0.5"
                      >
                        <Wifi size={14} className="mr-1" />
                        {host.last_status.icmp_ok ? "Online" : "Offline"}
                      </Badge>
                    </TableCell>

                    {/* HTTP */}
                    <TableCell>
                      <Badge
                        variant={host.last_status.http_ok ? "outline" : "destructive"}
                        className="px-2 py-0.5"
                      >
                        <Globe size={14} className="mr-1" />
                        {host.last_status.http_ok ? "OK" : "Erro"}
                      </Badge>
                    </TableCell>

                    {/* Latência */}
                    <TableCell>
                      {host.last_status.response_time !== null ? (
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${host.last_status.response_time < 30 ? 'bg-green-500' :
                            host.last_status.response_time < 300 ? 'bg-yellow-500' : 'bg-red-500'
                            }`} />
                          <span className="font-medium">{host.last_status.response_time !== null
                            ? (1000 * Number(host.last_status.response_time.toFixed(2)))
                            : null
                          } ms</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">—</span>
                      )}
                    </TableCell>

                    {/* Última Verificação */}
                    <TableCell className="pr-0 text-right">
                      <Tooltip>
                        <TooltipTrigger>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(host.last_status.checked_at).toLocaleTimeString()}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          {new Date(host.last_status.checked_at).toLocaleDateString()}
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>

                    {/* Gráfico */}
                    <TableCell className="pr-0 text-right">
                      <Dialog>
                        <DialogTrigger>
                          <Eye className="h-4 w-4" />
                        </DialogTrigger>
                        <DialogContent className="max-w-[90vw] h-[90vh] sm:max-w-[1200px]">
                          <DialogHeader>
                            <DialogTitle>Histórico - {host.name} - {host.ip}</DialogTitle>
                            <DialogDescription asChild>
                              <div className="h-[calc(90vh-100px)] overflow-y-auto p-5">
                                <HostChart hostId={host.id} hostInfo={host} />
                              </div>
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}