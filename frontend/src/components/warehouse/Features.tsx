import {
  Box,
  Container,
  Heading,
  VStack,
  Image,
  Text,
  useColorModeValue,
  IconButton,
  HStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

const MotionBox = motion(Box);

export default function FeaturesCarousel() {
  const bg = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");
  const cardHover = useColorModeValue("orange.50", "gray.600");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const subColor = useColorModeValue("gray.600", "gray.400");

  // 👇 số card hiển thị đồng thời (1 trên mobile, 3 trên md+)
  const itemsPerView = useBreakpointValue({ base: 1, md: 3 }) || 1;

  const features = useMemo(
    () => [
      {
        title: "Hợp đồng thông minh",
        desc: "Mọi giao dịch được ghi nhận minh bạch trên blockchain, đảm bảo quyền lợi cho cả hai bên.",
        img: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg",
      },
      {
        title: "Thuê kho nhanh chóng",
        desc: "Chỉ vài bước để chọn kho phù hợp và thanh toán tức thì bằng ví điện tử.",
        img: "https://cdn-icons-png.flaticon.com/512/5321/5321801.png",
      },
      {
        title: "An toàn & đảm bảo",
        desc: "Tiền đặt cọc được giữ an toàn trong hợp đồng cho đến khi thuê kết thúc.",
        img: "https://cdn-icons-png.flaticon.com/512/9293/9293193.png",
      },
      {
        title: "Giao diện trực quan",
        desc: "Dễ dàng theo dõi hợp đồng và trạng thái kho trong bảng điều khiển của bạn.",
        img: "https://cdn-icons-png.flaticon.com/512/201/201623.png",
      },
      {
        title: "Phí minh bạch",
        desc: "Không có chi phí ẩn. Tất cả giá thuê và cọc hiển thị rõ ràng.",
        img: "https://cdn-icons-png.flaticon.com/512/833/833472.png",
      },
    ],
    []
  );

  // 👉 mở rộng mảng: clone đuôi và đầu để loop vô hạn mượt (prev/next)
  const extended = useMemo(() => {
    const head = features.slice(0, itemsPerView);
    const tail = features.slice(-itemsPerView);
    return [...tail, ...features, ...head];
  }, [features, itemsPerView]);

  // index bắt đầu ở vị trí sau phần clone đầu (itemsPerView)
  const [index, setIndex] = useState(itemsPerView);
  const [jump, setJump] = useState(false); // khi true: bỏ animation (duration 0) để reset vị trí
  const [paused, setPaused] = useState(false);
  const duration = 0.55; // tốc độ trượt
  const timeoutRef = useRef<number | null>(null);

  // width mỗi item theo % để hiển thị đúng itemsPerView
  const slideWidthPercent = 100 / itemsPerView;

  // auto slide mỗi 4s (dừng khi hover)
  useEffect(() => {
    if (paused) return;
    timeoutRef.current = window.setTimeout(() => next(), 4000);
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [index, paused]);

  const next = () => {
    setIndex((prev) => prev + 1);
  };
  const prev = () => {
    setIndex((prev) => prev - 1);
  };

  // xử lý loop vô hạn:
  // - nếu đi quá cuối (đến clone cuối): sau khi animation xong, nhảy (không animation) về vị trí thật tương ứng
  // - nếu đi quá đầu (đến clone đầu): tương tự
  useEffect(() => {
    // đi quá phải: index chạm (extended.length - itemsPerView - 1) là phần tử clone sau cùng
    if (index >= extended.length - itemsPerView) {
      const t = setTimeout(() => {
        setJump(true);
        setIndex(itemsPerView); // quay về item thật đầu tiên
        // nhỏ giọt 1 tick để tắt "jump" -> animation lại bình thường
        setTimeout(() => setJump(false), 40);
      }, duration * 1000);
      return () => clearTimeout(t);
    }
    // đi quá trái: index = 0 là phần clone đầu
    if (index <= 0) {
      const t = setTimeout(() => {
        setJump(true);
        setIndex(features.length); // nhảy về item thật cuối cùng (trước phần head clone)
        setTimeout(() => setJump(false), 40);
      }, duration * 1000);
      return () => clearTimeout(t);
    }
  }, [index, extended.length, features.length, itemsPerView]);

  return (
    <Box py={20} bg={bg}>
      <Container maxW="6xl" position="relative">
        <Heading
          size="lg"
          mb={8}
          textAlign="center"
          color={textColor}
          fontWeight="bold"
        >
          Vì sao chọn nền tảng của chúng tôi?
        </Heading>

        {/* Nút điều hướng */}
        <HStack justify="space-between" mb={4}>
          <IconButton
            aria-label="prev"
            icon={<ChevronLeftIcon />}
            onClick={prev}
            variant="outline"
            colorScheme="orange"
            borderRadius="full"
          />
          <IconButton
            aria-label="next"
            icon={<ChevronRightIcon />}
            onClick={next}
            variant="outline"
            colorScheme="orange"
            borderRadius="full"
          />
        </HStack>

        {/* Viewport */}
        <Box
          position="relative"
          overflow="hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Track trượt ngang */}
          <MotionBox
            display="flex"
            // chiều rộng track = số item * (100/itemsPerView)%
            // nhưng vì dùng flex + width mỗi item theo % nên không cần set width cụ thể
            animate={{
              x: `-${index * slideWidthPercent}%`,
            }}
            transition={{
              duration: jump ? 0 : duration,
              ease: "easeInOut",
            }}
          >
            {extended.map((item, i) => (
              <Box
                key={`${item.title}-${i}`}
                flex={`0 0 ${slideWidthPercent}%`} // mỗi item chiếm 1/n bề ngang
                px={{ base: 2, md: 3 }}
              >
                <VStack
                  p={6}
                  bg={cardBg}
                  borderRadius="xl"
                  shadow="md"
                  textAlign="center"
                  h="100%"
                  transition="all 0.3s ease"
                  _hover={{
                    transform: "translateY(-6px) scale(1.02)",
                    shadow: "lg",
                    bg: cardHover,
                  }}
                >
                  <Image src={item.img} alt={item.title} boxSize="60px" />
                  <Heading fontSize="xl" color={textColor}>
                    {item.title}
                  </Heading>
                  <Text color={subColor}>{item.desc}</Text>
                </VStack>
              </Box>
            ))}
          </MotionBox>
        </Box>
      </Container>
    </Box>
  );
}
