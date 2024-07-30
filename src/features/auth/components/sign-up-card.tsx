"use client";

import Link from "next/link";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa6";
import { FcGoogle} from "react-icons/fc";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { useSignUp } from "@/features/auth/api/use-sign-up";
import { TriangleAlert } from "lucide-react";

export const SignUpCard = () => {
  const mutation = useSignUp();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");  

  const onCredentialSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutation.mutate({
      name,
      email,
      password
    }, {
      onSuccess: () => {
        signIn("credentials", {
          email,
          password,
          callbackUrl: "/",
        });
      }
    });
  }

  const onProviderSignUp = (provider: "github" | "google") => {
    signIn(provider, { callbackUrl: "/" });
  }

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>
          Create an account
        </CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>
      { 
        !!mutation.error && (
          <div className="bg-destructive/15 rounded-md p-3 flex items-center gap-x-2 text-sm text-destructive mb-6">
            <TriangleAlert className="size-4"/>
            <p>Something went wrong</p>
          </div>
        )
      }
      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={onCredentialSignIn} className="space-y-2.5">
          <Input 
            value={name}
            disabled={mutation.isPending}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            type="text"
            required
          />
          <Input 
            value={email}
            disabled={mutation.isPending}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
          />
          <Input 
            value={password}
            disabled={mutation.isPending}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
          />
          <Button type="submit" className="w-full" size="lg" disabled={mutation.isPending}>
            Continue
          </Button>
        </form>
        <Separator />
        <div className="space-y-2.5">
          <Button
            variant="outline"
            size="lg"
            className="w-full relative"
            onClick={() => onProviderSignUp("google")}
          >
            <FcGoogle className="mr-2 size-5 top-2.5 left-2.5 absolute"/>
            Continue with Google
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full relative"
            onClick={() => onProviderSignUp("github")}
          >
            <FaGithub className="mr-2 size-5 top-2.5 left-2.5 absolute"/>
            Continue with Github
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Already have an account? {" "}
          <Link href="/sign-in">
            <span className="text-sky-700 hover:underline">
              Sign in
            </span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}