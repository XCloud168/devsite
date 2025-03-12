
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {Button} from "@/components/ui/button";
import PricingBanner from "./_components/banner";
export default async function PricingPage() {


  return (
    <div className="container py-8">
        <PricingBanner></PricingBanner>
<div className=" grid grid-cols-3 gap-10 mt-5">
    <Card className="">
        <CardHeader>
            <CardTitle>月</CardTitle>
            <CardDescription>49.9 USDT</CardDescription>
        </CardHeader>
        <CardContent>
            <p>原价</p>
        </CardContent>
        <CardFooter className="flex justify-center">
            <Button>购买</Button>
        </CardFooter>
    </Card>


    <Card className="">
        <CardHeader>
            <CardTitle>季度</CardTitle>
            <CardDescription>127.5 USDT</CardDescription>
        </CardHeader>
        <CardContent>
            <p>原价</p>
        </CardContent>
        <CardFooter className="flex justify-center">
            <Button>购买</Button>
        </CardFooter>
    </Card>

    <Card className="">
        <CardHeader>
            <CardTitle>年</CardTitle>
            <CardDescription>449.5 USDT</CardDescription>
        </CardHeader>
        <CardContent>
            <p>原价</p>
        </CardContent>
        <CardFooter className="flex justify-center">
            <Button>购买</Button>
        </CardFooter>
    </Card>
</div>

    </div>
  );
}
