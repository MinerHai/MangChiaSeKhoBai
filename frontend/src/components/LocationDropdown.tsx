import React, { useEffect } from "react";
import {
  FormControl,
  FormLabel,
  Select,
  HStack,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface LocationData {
  province: string;
  provinceCode?: string;
  district: string;
  districtCode?: string;
  ward: string;
  wardCode?: string;
}

interface LocationSelectProps {
  value: LocationData;
  onChange: (newValue: LocationData) => void;
  isDisabled?: boolean;
  showLabels?: boolean;
}

// 🧭 Fetch helpers
const fetchProvinces = async () => {
  const res = await axios.get("https://provinces.open-api.vn/api/p/");
  return res.data;
};

const fetchDistricts = async (provinceCode: string) => {
  const res = await axios.get(
    `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`
  );
  return res.data.districts || [];
};

const fetchWards = async (districtCode: string) => {
  const res = await axios.get(
    `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
  );
  return res.data.wards || [];
};

export const LocationDropdown: React.FC<LocationSelectProps> = ({
  value,
  onChange,
  isDisabled = false,
  showLabels = true,
}) => {
  const {
    data: provinces = [],
    isLoading: loadingProvinces,
    error: errorProvinces,
  } = useQuery({
    queryKey: ["provinces"],
    queryFn: fetchProvinces,
    staleTime: 1000 * 60 * 60,
  });

  const { data: districts = [], isLoading: loadingDistricts } = useQuery({
    queryKey: ["districts", value.provinceCode],
    queryFn: () => fetchDistricts(value.provinceCode!),
    enabled: !!value.provinceCode,
    staleTime: 1000 * 60 * 60,
  });

  const { data: wards = [], isLoading: loadingWards } = useQuery({
    queryKey: ["wards", value.districtCode],
    queryFn: () => fetchWards(value.districtCode!),
    enabled: !!value.districtCode,
    staleTime: 1000 * 60 * 60,
  });

  // ✅ Tự động tìm code nếu chỉ có tên
  useEffect(() => {
    (async () => {
      if (provinces.length > 0 && !value.provinceCode && value.province) {
        const provinceObj = provinces.find(
          (p: any) => p.name === value.province
        );
        if (provinceObj) {
          const districtsData = await fetchDistricts(provinceObj.code);
          const districtObj = districtsData.find(
            (d: any) => d.name === value.district
          );
          let wardObj;
          if (districtObj) {
            const wardsData = await fetchWards(districtObj.code);
            wardObj = wardsData.find((w: any) => w.name === value.ward);
          }

          onChange({
            province: value.province,
            provinceCode: provinceObj.code,
            district: value.district,
            districtCode: districtObj?.code || "",
            ward: value.ward,
            wardCode: wardObj?.code || "",
          });
        }
      }
    })();
  }, [provinces, value.province, value.district, value.ward]);

  // 🌀 Event handlers
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.selectedOptions[0];
    const name = e.target.value;
    const code = selectedOption.getAttribute("data-code") || "";
    onChange({
      province: name,
      provinceCode: code,
      district: "",
      districtCode: "",
      ward: "",
      wardCode: "",
    });
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.selectedOptions[0];
    const name = e.target.value;
    const code = selectedOption.getAttribute("data-code") || "";
    onChange({
      ...value,
      district: name,
      districtCode: code,
      ward: "",
      wardCode: "",
    });
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.selectedOptions[0];
    const name = e.target.value;
    const code = selectedOption.getAttribute("data-code") || "";
    onChange({ ...value, ward: name, wardCode: code });
  };

  if (errorProvinces) {
    return <div>Lỗi tải danh sách tỉnh!</div>;
  }

  return (
    <HStack spacing={4} align="flex-end" wrap="wrap">
      {/* --- Province --- */}
      <FormControl isDisabled={isDisabled} flex="1">
        {showLabels && <FormLabel>Tỉnh / Thành phố</FormLabel>}
        {loadingProvinces ? (
          <Center py={2}>
            <Spinner size="sm" />
          </Center>
        ) : (
          <Select
            placeholder="Chọn tỉnh/thành phố"
            value={value.province || ""}
            onChange={handleProvinceChange}
          >
            {provinces.map((p: any) => (
              <option key={p.code} value={p.name} data-code={p.code}>
                {p.name}
              </option>
            ))}
          </Select>
        )}
      </FormControl>

      {/* --- District --- */}
      <FormControl isDisabled={!value.provinceCode || isDisabled} flex="1">
        {showLabels && <FormLabel>Quận / Huyện</FormLabel>}
        {loadingDistricts ? (
          <Center py={2}>
            <Spinner size="sm" />
          </Center>
        ) : (
          <Select
            placeholder="Chọn quận/huyện"
            value={value.district || ""}
            onChange={handleDistrictChange}
          >
            {districts.map((d: any) => (
              <option key={d.code} value={d.name} data-code={d.code}>
                {d.name}
              </option>
            ))}
          </Select>
        )}
      </FormControl>

      {/* --- Ward --- */}
      <FormControl isDisabled={!value.districtCode || isDisabled} flex="1">
        {showLabels && <FormLabel>Xã / Phường</FormLabel>}
        {loadingWards ? (
          <Center py={2}>
            <Spinner size="sm" />
          </Center>
        ) : (
          <Select
            placeholder="Chọn xã/phường"
            value={value.ward || ""}
            onChange={handleWardChange}
          >
            {wards.map((w: any) => (
              <option key={w.code} value={w.name} data-code={w.code}>
                {w.name}
              </option>
            ))}
          </Select>
        )}
      </FormControl>
    </HStack>
  );
};
