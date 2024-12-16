"use client";
//import { useState, useEffect } from 'react'
import Link from "next/link";
import { HiPencilAlt } from "react-icons/hi";
import RemoveBtn_Data from "./RemoveBtn_Data";

interface Commu {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
interface commusListProps {
  commus: Commu[];
}
export default function DatasList({ commus }: commusListProps) {
  return (
    <div>
      {commus.map((commu) => (
        <div
          key={commu._id}
          className="p-4 bg-sky-200 border border-slate-300 my-3 flex justify-between gap-5 items-start text-black"
        >
          <div>
            <h2 className="text-2xl font-bold">{commu.title}</h2>
            <div>{commu.description}</div>
            <div className="flex gap-4">
              <p>Created: {new Date(commu.createdAt).toLocaleDateString()}</p>
              <p>Updated: {new Date(commu.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <RemoveBtn_Data id={commu._id} />
            <Link href={`/editData/${commu._id}`}>
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
