"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

export default function Page() {
  return (
    <Container sx={{ py: 6 }}>
      <Stack spacing={3}>
        <Typography variant="h1">هدیه‌ای که به یاد می‌ماند</Typography>
        <Typography>
          این یک متن آزمایشی برای بررسی فونت، فاصله خطوط و جهت راست‌به‌چپ است.
          1,600,000 تومان
        </Typography>

        <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }} useFlexGap>
          <Button variant="contained" endIcon={<ArrowBackIcon />}>
            ادامه خرید
          </Button>
          <Button variant="contained" color="secondary">
            افزودن به سبد
          </Button>
          <Button variant="contained" color="accent">
            پیشنهاد ویژه
          </Button>
          <Button variant="outlined">مشاهده</Button>
          <Button variant="text">بعداً</Button>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Chip label="جدید" color="accent" />
          <Chip label="پرفروش" color="secondary" />
          <Link href="#">لینک آزمایشی</Link>
        </Stack>

        <Card>
          <CardContent>
            <Stack spacing={2} sx={{ maxWidth: 360 }}>
              <TextField label="شماره موبایل" placeholder="09121234567" />
              <TextField select label="رنگ" defaultValue="white">
                <MenuItem value="white">سفید</MenuItem>
                <MenuItem value="blue">آبی</MenuItem>
              </TextField>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
