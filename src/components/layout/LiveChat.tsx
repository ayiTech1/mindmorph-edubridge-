"use client";

import Script from "next/script";

/**
 * Tawk.to live chat (spec §6.8). Activates only when NEXT_PUBLIC_TAWK_PROPERTY_ID
 * is configured — otherwise this component renders nothing so dev builds stay clean.
 */
export function LiveChat() {
  const id = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID;
  const widget = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID ?? "default";
  if (!id) return null;
  return (
    <Script id="tawk-to" strategy="afterInteractive">
      {`
        var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
        (function(){
          var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
          s1.async=true;
          s1.src='https://embed.tawk.to/${id}/${widget}';
          s1.charset='UTF-8';
          s1.setAttribute('crossorigin','*');
          s0.parentNode.insertBefore(s1,s0);
        })();
      `}
    </Script>
  );
}
