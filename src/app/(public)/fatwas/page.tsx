import Link from "next/link";
import { Copy, Download, MessageCircle, Printer, Search, Share2 } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { listPublishedFatwas } from "@/lib/content-repository";
import { createMetadata, siteConfig } from "@/lib/site";

export const metadata = createMetadata({ title: "ഫത്വകൾ", path: "/fatwas" });

export default async function FatwasPage() {
  const fatwas = await listPublishedFatwas();

  return (
    <>
      <PageHero title="ഫത്വകൾ" description="ചോദ്യം, മറുപടി, നമ്പർ, വിഭാഗം, ടാഗുകൾ, തീയതി, അറ്റാച്ച്മെന്റ്, PDF, പ്രിന്റ്, related fatwas എന്നിവയോടെ." />
      <section className="container py-12">
        <div className="relative"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><Input className="pl-10" placeholder="ഫത്വ നമ്പർ, വിഷയം, വിഭാഗം തിരയുക" /></div>
        <div className="mt-8 grid gap-5">
          {fatwas.map((fatwa) => (
            <Card key={fatwa.number}>
              <CardHeader><div className="flex flex-wrap items-center gap-2"><Badge>{fatwa.number}</Badge><Badge>{fatwa.category}</Badge>{fatwa.tags.map((tag) => <Badge key={tag} className="bg-accent/15 text-accent">{tag}</Badge>)}</div><h2 className="text-2xl font-bold"><Link href={`/fatwas/${fatwa.slug}`}>{fatwa.title}</Link></h2></CardHeader>
              <CardContent><p className="font-bold">ചോദ്യം</p><p className="mt-2 leading-8 text-muted-foreground">{fatwa.question}</p><p className="mt-5 font-bold">മറുപടി</p><p className="mt-2 leading-8 text-muted-foreground">{fatwa.answer}</p><div className="mt-6 flex flex-wrap gap-2"><Button size="sm" variant="outline"><Share2 className="size-4" />Share</Button><Button size="sm" variant="outline"><Copy className="size-4" />Copy Link</Button><Button size="sm" variant="outline"><Download className="size-4" />PDF</Button><Button size="sm" variant="outline"><Printer className="size-4" />Print</Button></div></CardContent>
            </Card>
          ))}
        </div>
      </section>
      <Link className="fixed bottom-5 right-5 z-40" href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent("അസ്സലാമു അലൈക്കും. എനിക്ക് ഒരു ഫത്വ ചോദിക്കാനുണ്ട്.")}`}><Button size="lg"><MessageCircle className="size-4" />Ask Fatwa</Button></Link>
    </>
  );
}
