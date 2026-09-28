import { Component, inject, signal, computed } from '@angular/core';
import { MoneyPipe } from '../../../../shared/pipes/money.pipe';
import { DecimalPipe } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { OrderTableComponent } from '../../components/order-table/order-table.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AdminPageHeaderComponent } from '../../../../shared/components/admin-page-header/admin-page-header.component';
import { SearchInputComponent } from '../../../../shared/components/search-input/search-input.component';
import { ShipOrderDialogComponent } from '../../components/ship-order-dialog/ship-order-dialog.component';
import { Order, DeliveryStatus } from '../../models/order.model';
import { QrService } from '../../../../shared/services/qr.service';
import { environment } from '../../../../../environments/environment';
import { TEXTS } from '../../../../core/i18n/texts';

type TabFilter = 'all' | 'pending' | 'completed' | 'cancelled';
const PAGE_SIZE = 10;

@Component({
  selector: 'app-admin-orders',
  imports: [
    MoneyPipe, DecimalPipe, OrderTableComponent, ConfirmDialogComponent,
    AdminPageHeaderComponent, SearchInputComponent, ShipOrderDialogComponent,
  ],
  templateUrl: './admin-orders.component.html',
})
export class AdminOrdersComponent {
  private readonly orderService = inject(OrderService);
  private readonly qr           = inject(QrService);

  protected readonly t = TEXTS.admin.orders.page;
  protected readonly c = TEXTS.common;

  readonly searchTerm  = signal('');
  readonly activeTab   = signal<TabFilter>('all');
  readonly currentPage = signal(1);
  readonly stats       = this.orderService.stats;

  readonly isConfirmOpen  = signal(false);
  readonly orderToUpdate  = signal<Order | null>(null);
  readonly confirmTitle   = signal('');
  readonly confirmMessage = signal('');
  readonly confirmText    = signal('');
  private  nextStatus     = signal<DeliveryStatus>('delivered');

  readonly isShipDialogOpen = signal(false);
  readonly orderToShip      = signal<Order | null>(null);

  readonly tabs: { key: TabFilter; label: string }[] = [
    { key: 'all',       label: this.t.tabs.all       },
    { key: 'pending',   label: this.t.tabs.pending   },
    { key: 'completed', label: this.t.tabs.completed },
    { key: 'cancelled', label: this.t.tabs.cancelled },
  ];

  readonly filtered = computed(() => {
    let list = this.orderService.orders();
    const tab = this.activeTab();
    if (tab === 'pending')
      list = list.filter((o) => o.paymentStatus === 'pending' || ['preparing','shipped','pending_activation'].includes(o.deliveryStatus));
    if (tab === 'completed')
      list = list.filter((o) => o.paymentStatus === 'paid' && ['delivered','digital_active','subscription_active'].includes(o.deliveryStatus));
    if (tab === 'cancelled')
      list = list.filter((o) => o.paymentStatus === 'cancelled');
    const term = this.searchTerm().toLowerCase().trim();
    if (term) list = list.filter(
      (o) => o.orderNumber.toLowerCase().includes(term)
           || o.buyerName.toLowerCase().includes(term)
           || o.buyerEmail.toLowerCase().includes(term)
    );
    return list;
  });

  readonly paginated = computed(() => {
    const start = (this.currentPage() - 1) * PAGE_SIZE;
    return this.filtered().slice(start, start + PAGE_SIZE);
  });

  onTabChange(tab: TabFilter): void { this.activeTab.set(tab); this.currentPage.set(1); }
  onSearch(term: string): void { this.searchTerm.set(term); this.currentPage.set(1); }
  onPageChange(page: number): void { this.currentPage.set(page); }

  onViewOrder(order: Order): void {
    alert(this.t.detailComingSoon(order.orderNumber));
  }

  async onGenerateActivation(order: Order): Promise<void> {
    try {
      const licenses = await this.orderService.generateActivationLicenses(order.id);
      if (licenses.length === 0) { alert(this.t.noPhysicalProducts); return; }
      for (const l of licenses) {
        const url = `${environment.publicBaseUrl}/activate?code=${encodeURIComponent(l.code)}`;
        await this.qr.downloadPng(url, `qr-activacion-${l.code}`);
      }
      alert(this.t.activationGenerated(licenses.length, order.orderNumber));
    } catch (e: unknown) {
      const msg = (e as { error?: { detail?: string } })?.error?.detail ?? this.t.activationError;
      alert(msg);
    }
  }

  onChangeDelivery(order: Order): void {
    if (order.deliveryStatus === 'preparing') {
      this.orderToShip.set(order);
      this.isShipDialogOpen.set(true);
      return;
    }
    const map: Partial<Record<DeliveryStatus, { status: DeliveryStatus; label: string }>> = {
      shipped:            { status: 'delivered', label: this.t.markDelivered       },
      pending_activation: { status: 'delivered', label: this.t.confirmQrActivation },
    };
    const next = map[order.deliveryStatus];
    if (!next) return;
    this.orderToUpdate.set(order);
    this.nextStatus.set(next.status);
    this.confirmTitle.set(next.label);
    this.confirmMessage.set(this.t.confirmMessage(next.label, order.orderNumber, order.buyerName));
    this.confirmText.set(this.t.confirmText);
    this.isConfirmOpen.set(true);
  }

  onConfirm(): void {
    const order = this.orderToUpdate();
    if (order) this.orderService.updateDeliveryStatus(order.id, this.nextStatus());
    this.isConfirmOpen.set(false);
    this.orderToUpdate.set(null);
  }
  onCancelConfirm(): void { this.isConfirmOpen.set(false); this.orderToUpdate.set(null); }

  onShipConfirm(data: { carrier: string; trackingNumber: string; trackingUrl: string }): void {
    const order = this.orderToShip();
    if (order) {
      this.orderService.updateDeliveryStatus(order.id, 'shipped', {
        shippingCarrier: data.carrier,
        trackingNumber:  data.trackingNumber,
        trackingUrl:     data.trackingUrl || undefined,
      });
    }
    this.isShipDialogOpen.set(false);
    this.orderToShip.set(null);
  }
  onCancelShip(): void { this.isShipDialogOpen.set(false); this.orderToShip.set(null); }
}
