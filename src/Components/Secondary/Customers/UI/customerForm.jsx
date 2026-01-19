import { useEffect } from "react";

export default function Customer_Form({ editCustomer }) {
  const initialCustomerObj = {
    id: crypto.randomUUID(),
    name: "",
    email: "",
    phone: "",
  };
  const [customer, setCustomer] = useState(initialCustomerObj);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editCustomer) {
      setCustomer(editCustomer);
    }
  }, [editCustomer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
  };

  const validate = () => {};
}
