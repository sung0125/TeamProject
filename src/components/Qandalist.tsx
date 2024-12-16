"use client";
//import { useState, useEffect } from 'react'
import Link from "next/link";
import { HiPencilAlt } from "react-icons/hi";
import RemoveBtn_Data from "./RemoveBtn_Data";

interface Qanda {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
interface qandasListProps {
  qandas: Qanda[];
}
export default function DatasList({ qandas }: qandasListProps) {
  return (
    <div>
      {qandas.map((qanda) => (
        <div
          key={qanda._id}
          className="p-4 bg-sky-200 border border-slate-300 my-3 flex justify-between gap-5 items-start text-black"
        >
          <div>
            <h2 className="text-2xl font-bold">{qanda.title}</h2>
            <div>{qanda.description}</div>
            <div className="flex gap-4">
              <p>Created: {new Date(qanda.createdAt).toLocaleDateString()}</p>
              <p>Updated: {new Date(qanda.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <RemoveBtn_Data id={qanda._id} />
            <Link href={`/editData/${qanda._id}`}>
              <HiPencilAlt
                size={24}
                className="text-sky-500 hover:text-sky-800"
              />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
