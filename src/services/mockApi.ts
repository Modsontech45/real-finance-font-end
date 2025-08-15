import { faker } from '@faker-js/faker';
import { User, Transaction, Report, SignupData, LoginData, TransactionFormData } from '../types';

// Simulate network delay
const delay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

// Mock storage
class MockStorage {
  private users: User[] = [];
  private transactions: Transaction[] = [];
  private reports: Report[] = [];
  private currentUser: User | null = null;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Create default admin user
    const adminUser: User = {
      id: '1',
      username: 'admin',
      email: 'admin@company.com',
      companyName: 'Tech Innovations Inc.',
      country: 'US',
      phone: '+1234567890',
      role: 'admin',
      isVerified: true,
      createdAt: new Date().toISOString(),
    };

    // Create some viewer users
    const viewerUsers: User[] = Array.from({ length: 3 }, (_, i) => ({
      id: (i + 2).toString(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      companyName: 'Tech Innovations Inc.',
      country: faker.location.countryCode(),
      phone: faker.phone.number(),
      role: 'viewer' as const,
      isVerified: faker.datatype.boolean(),
      createdAt: faker.date.past().toISOString(),
    }));

    this.users = [adminUser, ...viewerUsers];

    // Generate mock transactions
    this.transactions = Array.from({ length: 20 }, (_, i) => ({
      id: (i + 1).toString(),
      date: faker.date.recent({ days: 90 }).toISOString().split('T')[0],
      name: faker.commerce.productName(),
      amount: faker.number.int({ min: 100, max: 10000 }),
      type: faker.helpers.arrayElement(['income', 'expense']) as 'income' | 'expense',
      comment: faker.lorem.sentence(),
      createdAt: faker.date.recent().toISOString(),
    }));

    // Generate mock reports
    this.reports = Array.from({ length: 8 }, (_, i) => ({
      id: (i + 1).toString(),
      title: `${faker.helpers.arrayElement(['Q1', 'Q2', 'Q3', 'Q4', 'Monthly', 'Weekly'])} ${faker.helpers.arrayElement(['Financial', 'Revenue', 'Expense', 'Performance'])} Report`,
      type: faker.helpers.arrayElement(['pdf', 'text']) as 'pdf' | 'text',
      content: faker.helpers.arrayElement(['pdf', 'text']) === 'text' ? faker.lorem.paragraphs(3) : undefined,
      fileUrl: faker.helpers.arrayElement(['pdf', 'text']) === 'pdf' ? '#' : undefined,
      uploadDate: faker.date.recent({ days: 30 }).toISOString().split('T')[0],
      keywords: faker.lorem.words(3).split(' '),
    }));
  }

  // Auth methods
  async signup(data: SignupData): Promise<{ success: boolean; message: string }> {
    await delay();
    
    const existingUser = this.users.find(u => u.email === data.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const newUser: User = {
      id: Date.now().toString(),
      username: data.username,
      email: data.email,
      companyName: data.companyName,
      country: data.country,
      phone: data.phone,
      role: 'admin',
      isVerified: false,
      createdAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    return { success: true, message: 'Account created successfully' };
  }

  async login(data: LoginData): Promise<User> {
    await delay();
    
    const user = this.users.find(u => u.email === data.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Simulate password check (in real app, this would be hashed)
    if (data.password !== 'password123') {
      throw new Error('Invalid email or password');
    }

    this.currentUser = user;
    localStorage.setItem('mockUser', JSON.stringify(user));
    return user;
  }

  async verifyEmail(token: string): Promise<{ success: boolean }> {
    await delay();
    return { success: true };
  }

  async resetPassword(email: string): Promise<{ success: boolean }> {
    await delay();
    const user = this.users.find(u => u.email === email);
    if (!user) {
      throw new Error('User not found');
    }
    return { success: true };
  }

  // Transaction methods
  async getTransactions(): Promise<Transaction[]> {
    await delay(500);
    return [...this.transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createTransaction(data: TransactionFormData): Promise<Transaction> {
    await delay();
    
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
    };

    this.transactions.unshift(newTransaction);
    return newTransaction;
  }

  async updateTransaction(id: string, data: Partial<TransactionFormData>): Promise<Transaction> {
    await delay();
    
    const index = this.transactions.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Transaction not found');
    }

    this.transactions[index] = { ...this.transactions[index], ...data };
    return this.transactions[index];
  }

  async deleteTransaction(id: string): Promise<void> {
    await delay();
    
    const index = this.transactions.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Transaction not found');
    }

    this.transactions.splice(index, 1);
  }

  // Member methods
  async getMembers(): Promise<User[]> {
    await delay(500);
    return [...this.users];
  }

  async inviteMember(email: string): Promise<{ success: boolean }> {
    await delay();
    
    const existingUser = this.users.find(u => u.email === email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // In real app, this would send an invitation email
    return { success: true };
  }

  async removeMember(id: string): Promise<void> {
    await delay();
    
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error('Member not found');
    }

    const user = this.users[index];
    if (user.role === 'admin') {
      throw new Error('Cannot remove admin user');
    }

    this.users.splice(index, 1);
  }

  // Report methods
  async getReports(): Promise<Report[]> {
    await delay(500);
    return [...this.reports].sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
  }

  async createReport(data: { title: string; type: 'pdf' | 'text'; content?: string }): Promise<Report> {
    await delay();
    
    const newReport: Report = {
      id: Date.now().toString(),
      title: data.title,
      type: data.type,
      content: data.content,
      fileUrl: data.type === 'pdf' ? '#' : undefined,
      uploadDate: new Date().toISOString().split('T')[0],
      keywords: data.title.toLowerCase().split(' '),
    };

    this.reports.unshift(newReport);
    return newReport;
  }

  async deleteReport(id: string): Promise<void> {
    await delay();
    
    const index = this.reports.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Report not found');
    }

    this.reports.splice(index, 1);
  }

  // Profile methods
  async updateProfile(id: string, data: Partial<User>): Promise<User> {
    await delay();
    
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error('User not found');
    }

    this.users[index] = { ...this.users[index], ...data };
    
    if (this.currentUser && this.currentUser.id === id) {
      this.currentUser = this.users[index];
      localStorage.setItem('mockUser', JSON.stringify(this.currentUser));
    }

    return this.users[index];
  }

  // Subscription methods
  async getSubscription(): Promise<{ plan: string; expirationDate: string; isActive: boolean }> {
    await delay(300);
    return {
      plan: 'free',
      expirationDate: '2024-12-31',
      isActive: true,
    };
  }

  async updateSubscription(plan: string): Promise<{ success: boolean }> {
    await delay();
    return { success: true };
  }

  // Initialize current user from localStorage
  getCurrentUser(): User | null {
    const stored = localStorage.getItem('mockUser');
    if (stored) {
      this.currentUser = JSON.parse(stored);
    }
    return this.currentUser;
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('mockUser');
  }
}

// Export singleton instance
export const mockApi = new MockStorage();