import { useNavigate } from "react-router-dom"
import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/Card.jsx"
import {Badge} from "./ui/Badge.jsx";
import Button from "./ui/Button.jsx";

export default function MatchGroupCard({ group }) {
    const navigate = useNavigate()
    const isFull = group.currentParticipants >= group.maxParticipants

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date)
    }

    return (
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <Badge variant={group.matchType === "screen" ? "info" : "success"} className="mb-2">
                        {group.matchType === "screen" ? "스크린" : "필드"}
                    </Badge>
                    <Badge variant={isFull ? "warning" : "success"}>{isFull ? "모집 완료" : "모집 중"}</Badge>
                </div>
                <CardTitle className="text-xl font-bold">{group.name}</CardTitle>
                <CardDescription className="line-clamp-2">{group.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPinIcon className="h-4 w-4 text-golf-green-600" />
                        <span>{group.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <CalendarIcon className="h-4 w-4 text-golf-green-600" />
                        <span>{formatDate(group.schedule)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <UsersIcon className="h-4 w-4 text-golf-green-600" />
                        <span>
              {group.currentParticipants}/{group.maxParticipants}명
            </span>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button
                    onClick={() => navigate(`/matchgroup/${group.id}`)}
                    disabled={isFull}
                    variant={isFull ? "outline" : "default"}
                    className="w-full"
                >
                    {isFull ? "모집 완료" : "참여 신청하기"}
                </Button>
            </CardFooter>
        </Card>
    )
}

