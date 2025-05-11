
import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  UserRound,
  Mail,
  Phone,
  Calendar,
  Clock
} from "lucide-react";

// Staff role types
type StaffRole = "manager" | "chef" | "waiter" | "cashier" | "cleaner";

// Staff member interface
interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  email: string;
  phone: string;
  avatar?: string;
  startDate: string;
  schedule: string;
  status: "active" | "on-leave" | "inactive";
}

const StaffOverview = () => {
  // Sample staff data
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    {
      id: "1",
      name: "John Smith",
      role: "manager",
      email: "john@mesa.com",
      phone: "+1 555-123-4567",
      avatar: "",
      startDate: "2023-01-15",
      schedule: "Mon-Fri, 9am-5pm",
      status: "active"
    },
    {
      id: "2",
      name: "Emily Chen",
      role: "chef",
      email: "emily@mesa.com",
      phone: "+1 555-234-5678",
      avatar: "",
      startDate: "2023-02-10",
      schedule: "Tue-Sat, 10am-6pm",
      status: "active"
    },
    {
      id: "3",
      name: "Miguel Rodriguez",
      role: "waiter",
      email: "miguel@mesa.com",
      phone: "+1 555-345-6789",
      avatar: "",
      startDate: "2023-03-05",
      schedule: "Wed-Sun, 4pm-12am",
      status: "active"
    },
    {
      id: "4",
      name: "Sarah Johnson",
      role: "cashier",
      email: "sarah@mesa.com",
      phone: "+1 555-456-7890",
      avatar: "",
      startDate: "2023-04-20",
      schedule: "Mon-Fri, 8am-4pm",
      status: "on-leave"
    },
    {
      id: "5",
      name: "David Lee",
      role: "chef",
      email: "david@mesa.com",
      phone: "+1 555-567-8901",
      avatar: "",
      startDate: "2023-05-12",
      schedule: "Thu-Mon, 11am-7pm",
      status: "active"
    },
    {
      id: "6",
      name: "Anna Wilson",
      role: "waiter",
      email: "anna@mesa.com",
      phone: "+1 555-678-9012",
      avatar: "",
      startDate: "2023-06-18",
      schedule: "Fri-Tue, 5pm-1am",
      status: "inactive"
    }
  ]);

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [role, setRole] = useState<StaffRole>("waiter");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [startDate, setStartDate] = useState("");
  const [schedule, setSchedule] = useState("");
  const [status, setStatus] = useState<"active" | "on-leave" | "inactive">("active");

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Filtered staff members based on search
  const filteredStaff = staffMembers.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add staff member
  const handleAddStaff = () => {
    if (!name || !email || !role || !phone) {
      toast.error("Barcha kerakli maydonlarni toʻldiring");
      return;
    }

    const newStaff: StaffMember = {
      id: Date.now().toString(),
      name,
      role,
      email,
      phone,
      startDate: startDate || new Date().toISOString().split('T')[0],
      schedule: schedule || "To be assigned",
      status: "active"
    };

    setStaffMembers([...staffMembers, newStaff]);
    resetForm();
    setIsAddDialogOpen(false);
    toast.success("Xodim muvaffaqiyatli qo‘shildi");
  };

  // Edit staff member
  const handleEditStaff = () => {
    if (!selectedStaff) return;

    if (!name || !email || !role || !phone) {
      toast.error("Barcha kerakli maydonlarni toʻldiring");
      return;
    }

    const updatedStaff = staffMembers.map((staff) => {
      if (staff.id === selectedStaff.id) {
        return {
          ...staff,
          name,
          role,
          email,
          phone,
          startDate,
          schedule,
          status
        };
      }
      return staff;
    });

    setStaffMembers(updatedStaff);
    resetForm();
    setIsEditDialogOpen(false);
    toast.success("Xodim muvaffaqiyatli yangilandi");
  };

  // Delete staff member
  const handleDeleteStaff = () => {
    if (!selectedStaff) return;

    const updatedStaff = staffMembers.filter(
      (staff) => staff.id !== selectedStaff.id
    );

    setStaffMembers(updatedStaff);
    setSelectedStaff(null);
    setIsDeleteDialogOpen(false);
    toast.success("Xodim muvaffaqiyatli oʻchirildi");
  };

  // Reset form
  const resetForm = () => {
    setName("");
    setRole("waiter");
    setEmail("");
    setPhone("");
    setStartDate("");
    setSchedule("");
    setStatus("active");
    setSelectedStaff(null);
  };

  // Open edit dialog
  const openEditDialog = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setName(staff.name);
    setRole(staff.role);
    setEmail(staff.email);
    setPhone(staff.phone);
    setStartDate(staff.startDate);
    setSchedule(staff.schedule);
    setStatus(staff.status);
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setIsDeleteDialogOpen(true);
  };

  // Get role badge color
  const getRoleBadgeColor = (role: StaffRole) => {
    switch (role) {
      case "manager":
        return "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300";
      case "chef":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "waiter":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "cashier":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "cleaner":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300";
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
      case "on-leave":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "inactive":
        return "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300";
    }
  };

  // Format role display name
  const formatRoleName = (role: StaffRole) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <AppLayout title="Xodimlar haqida umumiy ma'lumot">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-teal-600 bg-clip-text text-transparent">Xodimlar haqida umumiy ma'lumot</h1>
            <p className="text-gray-600 to'q:matn-gray-400">
              Restoran xodimlarini boshqaring
            </p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setIsAddDialogOpen(true);
            }}
            className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg hover:shadow-teal-500/20 transition-all duration-300"
          >
            <Plus className="mr-2 h-4 w-4" /> Xodimni qo'shish
          </Button>
        </div>
      </motion.div>

      <div className="mb-6">
        <div className="relative w-full sm:w-64">
          <Input
            placeholder="Xodimni qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border- shadow-md focus:ring-2 focus:ring-teal-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-4 w-4" />
        </div>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredStaff.length > 0 ? (
          filteredStaff.map((staff) => (
            <motion.div key={staff.id} variants={itemVariants}>
              <Card className="overflow-hidden group hover:-translate-y-1 transition-all duration-300 border-0 shadow-lg hover:shadow-xl">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      <div className="w-20 h-20 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white">
                        {staff.avatar ? (
                          <img
                            src={staff.avatar}
                            alt={staff.name}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <UserRound className="h-10 w-10" />
                        )}
                      </div>
                      <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-gray-800 ${staff.status === "active" ? "bg-emerald-500" :
                        staff.status === "on-leave" ? "bg-amber-500" :
                          "bg-rose-500"
                        }`}></span>
                    </div>

                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 text-center mt-2">{staff.name}</h3>

                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${getRoleBadgeColor(staff.role)}`}>
                      {formatRoleName(staff.role)}
                    </span>

                    <div className="w-full mt-4 space-y-3">
                      <div className="flex items-start">
                        <Mail className="h-4 w-4 text-teal-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-600 dark:text-gray-400 ml-2 overflow-hidden text-ellipsis">{staff.email}</p>
                      </div>

                      <div className="flex items-start">
                        <Phone className="h-4 w-4 text-teal-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-600 dark:text-gray-400 ml-2">{staff.phone}</p>
                      </div>

                      <div className="flex items-start">
                        <Calendar className="h-4 w-4 text-teal-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-600 dark:text-gray-400 ml-2">Buyon {new Date(staff.startDate).toLocaleDateString()}</p>
                      </div>

                      <div className="flex items-start">
                        <Clock className="h-4 w-4 text-teal-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-600 dark:text-gray-400 ml-2">{staff.schedule}</p>
                      </div>
                    </div>

                    <div className="flex justify-center mt-4 space-x-2 pt-4 border-t border-gray-100 dark:border-gray-800 w-full">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(staff)}
                        className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-900/20"
                      >
                        <Edit className="h-4 w-4 mr-1" /> Tahrirlash
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(staff)}
                        className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> O'chirish
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Hech qanday xodim topilmadi. Boshlash uchun bitta qo'shing.
            </p>
          </div>
        )}
      </motion.div>

      {/* Add Staff Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 shadow-2xl border-0 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl bg-gradient-to-r from-teal-500 to-teal-600 bg-clip-text text-transparent">Xodimni qo'shing</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">To'liq ismi</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 border- shadow-md focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <Label htmlFor="role" className="text-sm font-medium text-gray-700 dark:text-gray-300">Rol</Label>
              <Select value={role} onValueChange={(value) => setRole(value as StaffRole)}>
                <SelectTrigger id="role" className="mt-2 border- shadow-md focus:ring-2 focus:ring-teal-500">
                  <SelectValue placeholder="Rolni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manager">Menejer</SelectItem>
                  <SelectItem value="chef">Oshpaz</SelectItem>
                  <SelectItem value="waiter">Ofitsiant</SelectItem>
                  <SelectItem value="cashier">Kassir</SelectItem>
                  <SelectItem value="cleaner">Tozalash vositasi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Elektron pochta</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 border- shadow-md focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">Telefon</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-2 border- shadow-md focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <Label htmlFor="startDate" className="text-sm font-medium text-gray-700 dark:text-gray-300">Boshlanishi sanasi</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-2 border- shadow-md focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <Label htmlFor="schedule" className="text-sm font-medium text-gray-700 dark:text-gray-300">Ish jadvali</Label>
              <Input
                id="schedule"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                placeholder="e.g. Mon-Fri, 9am-5pm"
                className="mt-2 border- shadow-md focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}
              className="border- shadow-md hover:shadow-lg">
              Bekor qilish
            </Button>
            <Button onClick={handleAddStaff}
              className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg hover:shadow-teal-500/20">
              Xodimni qo'shish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Staff Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 shadow-2xl border-0 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl bg-gradient-to-r from-teal-500 to-teal-600 bg-clip-text text-transparent">Xodimni tahrirlash</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="editName" className="text-sm font-medium text-gray-700 dark:text-gray-300">To'liq ism</Label>
              <Input
                id="editName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 border- shadow-md focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <Label htmlFor="editRole" className="text-sm font-medium text-gray-700 dark:text-gray-300">Rol</Label>
              <Select value={role} onValueChange={(value) => setRole(value as StaffRole)}>
                <SelectTrigger id="editRole" className="mt-2 border- shadow-md focus:ring-2 focus:ring-teal-500">
                  <SelectValue placeholder="Rolni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manager">Menejer</SelectItem>
                  <SelectItem value="chef">Oshpaz</SelectItem>
                  <SelectItem value="waiter">Ofitsiant</SelectItem>
                  <SelectItem value="cashier">Kassir</SelectItem>
                  <SelectItem value="cleaner">Tozalash vositasi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="editEmail" className="text-sm font-medium text-gray-700 dark:text-gray-300">Elektron pochta</Label>
              <Input
                id="editEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 border- shadow-md focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <Label htmlFor="editPhone" className="text-sm font-medium text-gray-700 dark:text-gray-300">Telefon</Label>
              <Input
                id="editPhone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-2 border- shadow-md focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <Label htmlFor="editStartDate" className="text-sm font-medium text-gray-700 dark:text-gray-300">Boshlanish sanasi</Label>
              <Input
                id="editStartDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-2 border- shadow-md focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <Label htmlFor="editSchedule" className="text-sm font-medium text-gray-700 dark:text-gray-300">Ish jadvali</Label>
              <Input
                id="editSchedule"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                placeholder="masalan: Dush-Jum, 9:00-17:00"
                className="mt-2 border- shadow-md focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <Label htmlFor="editStatus" className="text-sm font-medium text-gray-700 dark:text-gray-300">Holati</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as "active" | "on-leave" | "inactive")}>
                <SelectTrigger id="editStatus" className="mt-2 border- shadow-md focus:ring-2 focus:ring-teal-500">
                  <SelectValue placeholder="Holatni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Faol</SelectItem>
                  <SelectItem value="on-leave">Ta’til</SelectItem>
                  <SelectItem value="inactive">Nofaol</SelectItem>

                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}
              className="border- shadow-md hover:shadow-lg">
              Bekor qilish
            </Button>
            <Button onClick={handleEditStaff}
              className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg hover:shadow-teal-500/20">
              Xodimni Yangilash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Staff Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 shadow-2xl border-0 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-red-500">Xodimni O‘chirish</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600 dark:text-gray-400">
              Siz rostdan ham {selectedStaff?.name} xodimini o‘chirib tashlamoqchimisiz? Bu amalni bekor qilib bo‘lmaydi.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}
              className="border- shadow-md hover:shadow-lg">
              Bekor qilish
            </Button>
            <Button variant="destructive" onClick={handleDeleteStaff}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-red-500/20 border-0">
              O'chirish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default StaffOverview;
