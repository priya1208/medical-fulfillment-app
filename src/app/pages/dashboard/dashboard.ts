import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { MedicineService } from '../../services/medicineservice';
import { CartService } from '../../services/cartservice';
@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  medicines: any[] = [
    { medicine_id: 1, medicine_name: 'Paracetamol 500mg', mrp: 23 },
    { medicine_id: 2, medicine_name: 'Ibuprofen 200mg', mrp: 28 },
    { medicine_id: 3, medicine_name: 'Aspirin 100mg', mrp: 30 },
    { medicine_id: 4, medicine_name: 'Cetirizine', mrp: 16 },
    { medicine_id: 5, medicine_name: 'Azithromycin', mrp: 70 },
    { medicine_id: 6, medicine_name: 'Dolo', mrp: 56},
  ];
  displayedMedicines: any[] = [];
  orderList: any[] = [];
  searchTerm: string = '';
  loading = false;

  constructor(
    private router: Router,
    private auth: Auth,
    private medicineService: MedicineService,
    private cart : CartService
  ) {}

  ngOnInit(): void {
    this.displayedMedicines = [];
  }

  loadMedicines(term: string = ''): void {
    if (!term.trim()) {
      this.displayedMedicines = [];
      return;
    }
    this.loading = true;

    // Try API call first
    this.medicineService.searchMedicines(term).subscribe({
      next: (res: any) => {
       
        if (res.data && res.data.length > 0) {
          this.displayedMedicines = res.data;
        } else {
          
          this.displayedMedicines = this.medicines.filter(med =>
            med.medicine_name.toLowerCase().includes(term.trim().toLowerCase())
          );
        }
        this.loading = false;
      },
      error: (err) => {
        
        this.displayedMedicines = this.medicines.filter(med =>
          med.medicine_name.toLowerCase().includes(term.trim().toLowerCase())
        );
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.loadMedicines(this.searchTerm);
  }

  addToOrder(med: any): void {
    if (!this.isAdded(med)) {
      this.orderList.push(med);
    }
  }

  removeFromOrder(med: any): void {
    this.orderList = this.orderList.filter(
      (m) => m.medicine_id !== med.medicine_id
    );
  }

  isAdded(med: any): boolean {
    return this.orderList.some((m) => m.medicine_id === med.medicine_id);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
  proceedToCheckout() {
  
  const orderListWithQty = this.orderList.map(med => ({
    ...med,
    qty: med.qty || 1 
  }));
  this.cart.setMedicines(orderListWithQty);
  this.router.navigate(['/checkout']);
}
}