"use client";
import { useState, useEffect } from 'react';

interface OpenAPISchema {
  type?: string;
  format?: string;
  properties?: Record<string, OpenAPISchema>;
  items?: OpenAPISchema;
  [key: string]: unknown;
}

interface OpenAPIParameter {
  name: string;
  in: string;
  required?: boolean;
  schema?: OpenAPISchema;
  description?: string;
}

interface OpenAPIOperation {
  summary?: string;
  description?: string;
  tags?: string[];
  parameters?: OpenAPIParameter[];
  requestBody?: Record<string, unknown>;
  responses?: Record<string, {
    description: string;
    content?: Record<string, unknown>;
  }>;
}

interface OpenAPISpec {
  openapi: string;
  info: {
    title: string;
    version: string;
    description: string;
  };
  servers: Array<{ url: string }>;
  paths: Record<string, Record<string, OpenAPIOperation>>;
  components: {
    schemas: Record<string, OpenAPISchema>;
  };
}

interface CustomOpenAPIDocsProps {
  specUrl: string;
}

export default function CustomOpenAPIDocs({ specUrl }: CustomOpenAPIDocsProps) {
  const [spec, setSpec] = useState<OpenAPISpec | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOperations, setExpandedOperations] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch(specUrl)
      .then(res => res.json())
      .then(data => {
        setSpec(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [specUrl]);

  const toggleOperation = (operationId: string) => {
    const newExpanded = new Set(expandedOperations);
    if (newExpanded.has(operationId)) {
      newExpanded.delete(operationId);
    } else {
      newExpanded.add(operationId);
    }
    setExpandedOperations(newExpanded);
  };

  const getMethodColor = (method: string) => {
    switch (method.toLowerCase()) {
      case 'get': return 'bg-green-100 text-green-800';
      case 'post': return 'bg-blue-100 text-blue-800';
      case 'put': return 'bg-yellow-100 text-yellow-800';
      case 'delete': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800">Error loading API documentation: {error}</p>
      </div>
    );
  }

  if (!spec) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <p className="text-yellow-800">No API specification found</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{spec.info.title}</h1>
        <p className="text-gray-600 mb-4">{spec.info.description}</p>
        <div className="text-sm text-gray-500">
          <span className="font-semibold">Version:</span> {spec.info.version} | 
          <span className="font-semibold ml-2">OpenAPI:</span> {spec.openapi}
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(spec.paths).map(([path, pathItem]) => (
          <div key={path} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 font-mono">{path}</h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {Object.entries(pathItem).map(([method, operation]: [string, OpenAPIOperation]) => {
                const operationId = `${method.toUpperCase()} ${path}`;
                const isExpanded = expandedOperations.has(operationId);
                
                return (
                  <div key={method} className="p-4">
                    <button
                      onClick={() => toggleOperation(operationId)}
                      className="flex items-center justify-between w-full text-left hover:bg-gray-50 p-2 rounded"
                    >
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getMethodColor(method)}`}>
                          {method.toUpperCase()}
                        </span>
                        <span className="font-medium text-gray-900">{operation.summary || operationId}</span>
                        {operation.tags && (
                          <span className="text-sm text-gray-500">
                            {operation.tags.join(', ')}
                          </span>
                        )}
                      </div>
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {isExpanded && (
                      <div className="mt-4 space-y-4">
                        {operation.description && (
                          <p className="text-gray-700">{operation.description}</p>
                        )}
                        
                        {operation.parameters && operation.parameters.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Parameters</h4>
                            <div className="space-y-2">
                              {operation.parameters.map((param: OpenAPIParameter, index: number) => (
                                <div key={index} className="bg-gray-50 p-3 rounded">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-mono text-sm font-semibold">{param.name}</span>
                                    <span className="text-xs text-gray-500">({param.in})</span>
                                    {param.required && (
                                      <span className="text-xs text-red-600 font-semibold">required</span>
                                    )}
                                  </div>
                                  {param.schema && (
                                    <div className="text-sm text-gray-600 mt-1">
                                      Type: {param.schema.type}
                                      {param.schema.format && ` (${param.schema.format})`}
                                    </div>
                                  )}
                                  {param.description && (
                                    <div className="text-sm text-gray-600 mt-1">{param.description}</div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {operation.requestBody && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Request Body</h4>
                            <div className="bg-gray-50 p-3 rounded">
                              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                                {JSON.stringify(operation.requestBody, null, 2)}
                              </pre>
                            </div>
                          </div>
                        )}
                        
                        {operation.responses && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Responses</h4>
                            <div className="space-y-2">
                              {Object.entries(operation.responses).map(([statusCode, response]: [string, { description: string; content?: Record<string, unknown> }]) => (
                                <div key={statusCode} className="bg-gray-50 p-3 rounded">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-semibold text-gray-900">{statusCode}</span>
                                    <span className="text-gray-600">{response.description}</span>
                                  </div>
                                  {response.content && (
                                    <div className="mt-2">
                                      <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                                        {JSON.stringify(response.content, null, 2)}
                                      </pre>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
