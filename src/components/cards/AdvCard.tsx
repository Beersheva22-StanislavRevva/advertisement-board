import { Button, Card, CardActions, CardContent, Typography } from "@mui/material"
import Adv from "../../model/Adv"
type Props = {
    advFull: any;
    actionFn: (isDelete: boolean) => void
}
const AdvCard: React.FC<Props> = ({ advFull, actionFn }) => {
     function getCardinfo(advFull: any) {
          const keys = Object.keys(advFull);
          const res = keys.map(el => {
               const value = advFull[el];
               return <Typography variant="h5" ml={7}>
                    {el}:{value}
               </Typography>;
               })
          return res;
     }
      return (
        <Card sx={{ minWidth: 275 }}>
          <CardContent> 
          {getCardinfo(advFull)}
          {/* <Typography variant="h5" ml={7}>
                   id: {adv.id}
              </Typography>
              <Typography variant="h5" ml={7} >
                   name: {adv.name}
              </Typography>
              <Typography variant="h5" ml={7} >
                   category: {adv.category}
              </Typography>
              <Typography variant="h5" ml={7} >
                   price: {adv.price}
              </Typography>
              <Typography variant="h5" ml={7}>
                   aditional info: {adv.catFields}
              </Typography> */}
          </CardContent>
            <Button size="small"onClick={() =>actionFn(false) }>Update</Button>
            <Button size="small" onClick={() =>actionFn(true)}>Delete</Button>
        </Card>
      );
    }
    export default AdvCard;