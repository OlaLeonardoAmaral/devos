import React, { useEffect, useState } from "react";
import { ArrowsCounterClockwise } from "@phosphor-icons/react";

interface LogEntry {
  timestamp: string;
  type: "error" | "moved";
  file: string;
  error_message?: string;
  from_path?: string;
  to_path?: string;
}

const LogsPage: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const response = await window.api?.readLogs();
      setLogs(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Erro ao carregar logs:", error);
      setLogs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(); // Carrega os logs ao montar o componente
  }, []);

  return (
    <main className="flex-grow bg-rotion-800 text-rotion-50 p-8 shadow-green-light">
      <header className="flex flex-col gap-3 text-rotion-50 p-2">
        <div className="flex items-center gap-4 w-full">
          <h1 className="text-4xl font-bold flex-grow truncate">Logs</h1>
          <button
            onClick={fetchLogs}
            className="flex items-center justify-center p-2 rounded hover:bg-rotion-700"
            aria-label="Recarregar logs"
          >
            <ArrowsCounterClockwise
              size={32}
              className={`text-rotion-50 ${isLoading ? "icon-spin" : ""}`}
            />
          </button>
        </div>
      </header>

      <div className="max-h-[calc(100vh-160px)] p-4 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[calc(100vh-180px)]">
            <span className="text-rotion-400 text-lg">Carregando...</span>
          </div>
        ) : logs.length > 0 ? (
          <div className="space-y-6">
            {(() => {
              // Agrupar logs por dia
              const logsByDay: { [key: string]: LogEntry[] } = {};
              logs.forEach((log) => {
                const date = new Date(log.timestamp);
                const dayKey = date.toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                });
                if (!logsByDay[dayKey]) logsByDay[dayKey] = [];
                logsByDay[dayKey].push(log);
              });

              return Object.entries(logsByDay).map(
                ([day, dayLogs], dayIndex) => {
                  const date = new Date(dayLogs[0].timestamp); // Pega a data do primeiro log do dia
                  const weekday =
                    date
                      .toLocaleDateString("pt-BR", { weekday: "short" })
                      .replace(".", "")
                      .charAt(0)
                      .toUpperCase() +
                    date
                      .toLocaleDateString("pt-BR", { weekday: "short" })
                      .replace(".", "")
                      .slice(1);
                  const formattedHeader = `${weekday} ${day.charAt(0).toUpperCase() + day.slice(1)}`;

                  return (
                    <div key={dayIndex} className="space-y-4">
                      <h2 className="text-xl font-semibold text-rotion-100 border-b border-rotion-700 pb-2">
                        {formattedHeader}
                      </h2>
                      {dayLogs.map((log, logIndex) => (
                        <div
                          key={logIndex}
                          className={`p-4 rounded-lg ${
                            log.type === "error"
                              ? "bg-red-900/20 border border-red-500"
                              : "bg-rotion-700"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-rotion-300">
                              {new Date(log.timestamp).toLocaleTimeString(
                                "pt-BR"
                              )}
                            </span>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                log.type === "error"
                                  ? "bg-red-500"
                                  : "bg-green-500"
                              }`}
                            >
                              {log.type.toUpperCase()}
                            </span>
                          </div>
                          <p className="mt-1 text-rotion-50">
                            <strong>Arquivo:</strong> {log.file}
                          </p>
                          {log.type === "moved" && (
                            <>
                              <p className="text-rotion-400">
                                <strong>De:</strong> {log.from_path}
                              </p>
                              <p className="text-rotion-400">
                                <strong>Para:</strong> {log.to_path}
                              </p>
                            </>
                          )}
                          {log.type === "error" && (
                            <p className="text-red-300 mt-1">
                              <strong>Erro:</strong> {log.error_message}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                }
              );
            })()}
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[calc(100vh-180px)]">
            <span className="text-rotion-400 text-lg">
              Nenhum log encontrado
            </span>
          </div>
        )}
      </div>
    </main>
  );
};

export default LogsPage;
