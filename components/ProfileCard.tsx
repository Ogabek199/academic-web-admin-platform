"use client";

import { Profile } from "@/types";
import { Mail, Globe, ExternalLink } from "lucide-react";
import Image from "next/image";

interface ProfileCardProps {
  profile: Profile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
        <div className="flex items-start space-x-6">
          {profile.photo ? (
            <Image
              src={profile.photo}
              alt={profile.name}
              width={128}
              height={128}
              className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg"
            />
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-blue-500 text-3xl font-bold text-white shadow-lg">
              {profile.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 text-white">
            <h1 className="text-3xl font-bold">{profile.name}</h1>
            <p className="mt-1 text-lg text-blue-100">{profile.title}</p>
            <p className="mt-2 text-blue-100">{profile.affiliation}</p>
            <div className="mt-4 flex flex-wrap gap-4">
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center space-x-1 text-sm text-blue-100 hover:text-white"
                >
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </a>
              )}
              {profile.contact.website && (
                <a
                  href={profile.contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-sm text-blue-100 hover:text-white"
                >
                  <Globe className="h-4 w-4" />
                  <span>Website</span>
                </a>
              )}
              {profile.contact.googleScholar && (
                <a
                  href={profile.contact.googleScholar}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-sm text-blue-100 hover:text-white"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Google Scholar</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {profile.bio && (
          <div className="mb-6">
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              Biografiya
            </h2>
            <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
          </div>
        )}

        {profile.researchInterests.length > 0 && (
          <div className="mb-6">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">
              Tadqiqot sohalari
            </h2>
            <div className="flex flex-wrap gap-2">
              {profile.researchInterests.map((interest, index) => (
                <span
                  key={index}
                  className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {profile.education.length > 0 && (
          <div>
            <h2 className="mb-3 text-lg font-semibold text-gray-900">
              Ta&apos;lim
            </h2>
            <div className="space-y-3">
              {profile.education.map((edu, index) => (
                <div key={index} className="border-l-2 border-blue-200 pl-4">
                  <p className="font-medium text-gray-900">{edu.degree}</p>
                  <p className="text-gray-600">{edu.institution}</p>
                  <p className="text-sm text-gray-500">{edu.year}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
