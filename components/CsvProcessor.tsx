"use client";

import React, { useState, ChangeEvent } from "react";
import Papa, { ParseResult } from "papaparse";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TransformationEditor from "./TransformationEditor";

interface CsvData {
    header: string[];
    rows: string[][];
}

const exampleCSV = `
Cardholder,Card name,Merchant,Amount,Category,GL code,Project,Cost code,Cost type,Date,Note
John Doe,John Doe Personal Card,Gas Station Plus,$25.50,Fuel,5010 - Travel Expenses,"Project Alpha:Phase 1",Fuel & Mileage,Direct Project Cost,05/20/2024,Refuel truck
Jane Smith,Jane Smith Business Card,Office Supplies Co.,$78.20,Office Supplies,6020 - Office Supplies,"Internal:Admin",General Supplies,Overhead,05/21/2024,Printer paper and pens
Robert Johnson,Robert Johnson Corp Card,Tech Gadgets Inc.,$199.99,Electronics,1500 - Equipment Purchase,"Project Beta:Setup",Computer Hardware,Capital Expenditure,05/22/2024,New monitor for dev team
Emily White,Emily White Travel Card,Cloud Services LLC,$50.00,Software Subscription,7030 - Software & Subscriptions,"Project Gamma:Deployment",Cloud Hosting,Operational Expense,05/23/2024,Monthly server cost
`;

export default function CsvProcessor() {
    const [csvData, setCsvData] = useState<CsvData | null>(null);
    const [fileName, setFileName] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const processParsedData = (results: ParseResult<string[]>, sourceName: string) => {
        if (results.errors.length > 0) {
            setError(`Error parsing CSV (${sourceName}): ${results.errors[0].message}`);
            console.error(`CSV Parsing Errors (${sourceName}):`, results.errors);
            setCsvData(null);
            setFileName("");
        } else if (results.data.length > 0) {
            const header = results.data[0];
            // Display only the first 2 data rows (index 1 and 2)
            const rows = results.data.slice(1, 3);
            setCsvData({ header, rows });
            setFileName(sourceName);
            setError(null);
        } else {
            setError(`CSV file (${sourceName}) is empty or contains no data.`);
            setCsvData(null);
            setFileName("");
        }
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        setFileName(file.name);
        setError(null);
        setCsvData(null);

        Papa.parse<string[]>(file, {
            header: false,
            skipEmptyLines: true,
            complete: (results) => {
                processParsedData(results, file.name);
            },
            error: (err: Error) => {
                setError(`Failed to parse file: ${err.message}`);
                console.error("PapaParse Error:", err);
                setCsvData(null);
                setFileName("");
                if (event.target) {
                    event.target.value = '';
                }
            },
        });
    };

    const handleLoadExample = () => {
        setError(null);
        setCsvData(null);
        Papa.parse<string[]>(exampleCSV.trim(), {
            header: false,
            skipEmptyLines: true,
            complete: (results) => {
                processParsedData(results, "Example CSV");
            },
            error: (err: Error) => {
                setError(`Failed to parse example CSV: ${err.message}`);
                console.error("Example PapaParse Error:", err);
                setCsvData(null);
                setFileName("");
            },
        });
    };

    return (
        <>
            <Card className="w-full max-w-4xl mx-auto mb-6">
                <CardHeader>
                    <CardTitle>1. Upload or Load Example CSV</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                        <div className="flex-1 grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="csv-upload">Upload CSV File</Label>
                            <Input
                                id="csv-upload"
                                type="file"
                                accept=".csv"
                                onChange={handleFileChange}
                                className="cursor-pointer"
                            />
                        </div>
                        <div className="flex items-end">
                            <Button onClick={handleLoadExample} variant="outline">
                                Load Example
                            </Button>
                        </div>
                    </div>

                    {fileName && <p className="text-sm text-muted-foreground mb-2">Source: {fileName}</p>}
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                    {csvData && (
                        <div>
                            <h3 className="text-lg font-semibold mb-2">CSV Preview (Header and first 2 rows)</h3>
                            <div className="overflow-x-auto border rounded-md">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            {csvData.header.map((col, index) => (
                                                <TableHead key={index}>{col}</TableHead>
                                            ))}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {csvData.rows.map((row, rowIndex) => (
                                            <TableRow key={rowIndex}>
                                                {row.map((cell, cellIndex) => (
                                                    <TableCell key={cellIndex}>{cell}</TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {csvData && csvData.header.length > 0 && (
                <Card className="w-full max-w-6xl mx-auto">
                    <CardHeader>
                        <CardTitle>2. Define Transformations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TransformationEditor csvHeaders={csvData.header} />
                    </CardContent>
                </Card>
            )}
        </>
    );
}