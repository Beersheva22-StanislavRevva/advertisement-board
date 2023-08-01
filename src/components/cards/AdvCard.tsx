import { Button, Card, CardActions, CardContent, Typography } from "@mui/material"
import Adv from "../../model/Adv"
type Props = {
    adv: Adv;
    actionFn: (isDelete: boolean) => void
}
const AdvCard: React.FC<Props> = ({adv, actionFn}) => {
    
      return (
        <Card sx={{ minWidth: 275 }}>
          <CardContent> 
          <Typography variant="h5" ml={7}>
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
              </Typography>
          </CardContent>
            <Button size="small"onClick={() =>actionFn(false) }>Update</Button>
            <Button size="small" onClick={() =>actionFn(true)}>Delete</Button>
        </Card>
      );
    }
    export default AdvCard;