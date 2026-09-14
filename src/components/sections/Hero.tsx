import Image from "next/image";
import Link from "next/link";
import { ArrowIcon, CheckIcon, WhatsAppIcon } from "../icons";
import { whatsappLink, whatsappMessages } from "@/lib/site";
import { hero } from "@/lib/content";
import { images } from "@/lib/images";

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-navy-950 pt-[72px] text-white">
      {/* Ambient wash — pure CSS, so nothing here costs a network request. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-sky-brand/18 blur-[120px]" />
        <div className="absolute -bottom-52 right-[-12rem] h-[36rem] w-[36rem] rounded-full bg-gold-500/12 blur-[130px]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "68px 68px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)",
          }}
        />
      </div>

      <div className="shell relative grid items-center gap-14 py-20 lg:grid-cols-[1.08fr_0.92fr] lg:py-28">
        <div className="reveal">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-gold-400 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
            Online &amp; In-Person · Ghana
          </span>

          <h1 className="mt-6 font-display text-[2.5rem] font-extrabold leading-[1.08] text-white sm:text-5xl lg:text-[3.6rem]">
            {hero.headline}
            <span className="mt-2 block bg-gradient-to-r from-gold-400 via-gold-500 to-gold-300 bg-clip-text text-transparent">
              {hero.headlineAccent}
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-navy-100/85 sm:text-lg">
            {hero.subheadline}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/apply" className="btn-gold">
              Start Learning Today
              <ArrowIcon />
            </Link>
            <a
              href={whatsappLink(whatsappMessages.general)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Chat Us On WhatsApp
            </a>
          </div>

          <ul className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-6 text-sm text-navy-100/75">
            {hero.trustLine.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 shrink-0 text-gold-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* A student's face first; the result card overlaps it, so the promise and
            the person it is about are read together. */}
        <div className="reveal [animation-delay:150ms]">
          <div className="relative mx-auto max-w-md pb-40 sm:pb-44 lg:pb-48">
            <div aria-hidden className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-gold-500/25 to-sky-brand/20 blur-2xl" />

            <div className="relative overflow-hidden rounded-3xl border border-white/12 shadow-2xl shadow-navy-950/60">
              <Image
                src={images.hero.src}
                alt={images.hero.alt}
                priority
                sizes="(max-width: 1024px) 90vw, 28rem"
                placeholder="blur"
                className="h-auto w-full object-cover"
              />
              {/* Keeps the card below legible over a light patch of photo. */}
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy-950/80 to-transparent"
              />
            </div>

            <div className="absolute inset-x-4 bottom-0 rounded-3xl border border-white/12 bg-navy-950/80 p-6 backdrop-blur-xl sm:inset-x-6">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-navy-100/60">
                  Student progress
                </p>
                <span className="rounded-full bg-whatsapp/15 px-3 py-1 text-xs font-semibold text-whatsapp">
                  Live
                </span>
              </div>

              <p className="mt-4 font-display text-xl font-bold text-white sm:text-2xl">
                From <span className="text-red-300/90">D</span> to{" "}
                <span className="text-gold-400">A*</span> in IGCSE Maths
              </p>

              <div className="mt-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-navy-100/80">Mock exam readiness</span>
                  <span className="font-semibold text-gold-400">76%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[76%] rounded-full bg-gradient-to-r from-gold-500 to-gold-300" />
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gold-500 font-display text-xs font-extrabold text-navy-900">
                  500+
                </div>
                <p className="text-sm text-navy-100/80">
                  students already learning with MindMorph.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
